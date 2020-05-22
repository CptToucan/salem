import {
  removeCardFromCurrentPlayer,
  removeCardFromPlayersHand,
  playCardOnPlayer,
  calculateAccusationsOnPlayer,
  hasCardAgainst,
  removeCardColourFromPlayer,
  removeCardTypeFromPlayer,
  addCardToDiscardPile,
} from "./utils/salem";
import {
  getCurrentPlayerState,
  getPlayerState,
  isWitchRevealed,
  allTryalCardsRevealed,
  killPlayer,
  updatePlayerRoles
} from "./utils/player";
import { revealTryalCard } from "./utils/tryal";

function generateSalemCardType(title, numberOfCards = 0) {
  let cards = [];

  let cardIdParts = title.split("_");
  let cardTitle = cardIdParts[0];
  let cardColour = cardIdParts[1];

  for (let i = 0; i < numberOfCards; i++) {
    let cardDef = {
      id: `${cardTitle}-${i}`,
      title: `${cardTitle}`,
      type: cardTitle.toUpperCase(),
      colour: cardColour,
    };

    if (cardIdParts[1] === undefined) {
      cardDef.isRevealed = false;
    }

    cards.push(cardDef);
  }
  return cards;
}

const ACCUSATIONS_NEEDED_FOR_TRYAL = 7;

const CARDS_DEF = {
  Accusation_RED: 35, //red
  Evidence_RED: 5, // red
  Witness_RED: 1, // red
  Stocks_GREEN: 3, // green
  Alibi_GREEN: 3, // green
  Scapegoat_GREEN: 2, // green
  Arson_GREEN: 1, // green
  Robbery_GREEN: 1, // green
  Curse_GREEN: 1, // blue
  Matchmaker_BLUE: 2, // blue
  Asylum_BLUE: 1, // blue
  Piety_BLUE: 1, // blue
};

const SETUPS = {
  4: {
    not: 18,
    witch: 1,
    constable: 1,
  },
  5: {
    not: 23,
    witch: 1,
    constable: 1,
  },
  6: {
    not: 27,
    witch: 2,
    constable: 1,
  },
  7: {
    not: 32,
    witch: 2,
    constable: 1,
  },
  8: {
    not: 29,
    witch: 2,
    constable: 1,
  },
  9: {
    not: 33,
    witch: 2,
    constable: 1,
  },
  10: {
    not: 27,
    witch: 2,
    constable: 1,
  },
  11: {
    not: 30,
    witch: 2,
    constable: 1,
  },
  12: {
    not: 33,
    witch: 2,
    constable: 1,
  },
};

const CHARACTERS = [
  "Ann Putnam",
  "Giles Corey",
  "Samuel Parris",
  "Rebecca Nurse",
  "Abigail Williams",
  "Mary Warren",
  "Cotton Mather",
  "William Phips",
  "Thomas Danforth",
  "Marth Corey",
  "Sarah Good",
  "George Burroughs",
  "John Proctor",
  "Tituba",
  "Will Griggs",
];

function initializePlayers(numPlayers) {
  let defaultPlayers = {};
  for (let playerId = 0; playerId < numPlayers; playerId++) {
    defaultPlayers[playerId] = {
      isWitch: false,
      isConstable: false,
      character: "",
      hand: [],
      tryalCards: [],
      tryalCardCount: 0,
      _pickedTryalCard: null,
      appliedBlueCards: [],
      appliedRedCards: [],
      appliedGreenCards: [],
    };
  }

  return defaultPlayers;
}

function drawCardFromDeck(G, ctx) {

  if(G.salemDeck.length <= 0) {
    let newDeck = [];
    let nightCard = [];

    for(let card of G.salemDiscard) {
      if(card.type !== "NIGHT") {
        newDeck.push(card);
      }
      else {
        nightCard.push(card);
      }
      
    }

    newDeck = ctx.random.Shuffle(newDeck);
    newDeck.push(...nightCard);

    G.salemDeck = newDeck;
  }



  let newSalemDeck = [...G.salemDeck];
  let playerState = getPlayerState(G, ctx, ctx.currentPlayer);
  let cardToAssign = newSalemDeck.pop();
  let newHand = [...playerState.hand];
  newHand.push(cardToAssign);
  playerState.hand = newHand;
  G.salemDeck = newSalemDeck;

  return cardToAssign;
}

export const Salem = {
  name: "Salem",
  setup: (ctx) => {
    let salemDeck = [];
    for (let card in CARDS_DEF) {
      salemDeck = salemDeck.concat(
        generateSalemCardType(card, CARDS_DEF[card])
      );
    }

    let setupState = SETUPS[ctx.numPlayers];

    let witchCardDeck = [];

    for (let card in setupState) {
      witchCardDeck = witchCardDeck.concat(
        generateSalemCardType(card, setupState[card])
      );
    }

    salemDeck = ctx.random.Shuffle(salemDeck);
    let witchDeck = ctx.random.Shuffle(witchCardDeck);
    let characterDeck = ctx.random.Shuffle(CHARACTERS);

    let playerState = initializePlayers(ctx.numPlayers);

    // Assign characters
    let alivePlayers = [...ctx.playOrder];
    for (let player of alivePlayers) {
      playerState[player].character = characterDeck.pop();
    }

    // Assign witch cards
    while (witchDeck.length > 0) {
      for (let player of alivePlayers) {
        let cardToAdd = witchDeck.pop();

        if (cardToAdd.type === "WITCH") {
          playerState[player].isWitch = true;
        }

        if (cardToAdd.type === "CONSTABLE") {
          playerState[player].isConstable = true;
        }

        playerState[player].tryalCards.push(cardToAdd);
        playerState[player].tryalCardCount++;
      }
    }

    // Assign hand
    for (let player of alivePlayers) {
      playerState[player].hand.push(salemDeck.pop());
      playerState[player].hand.push(salemDeck.pop());
      playerState[player].hand.push(salemDeck.pop());
    }

    let conspiracyCard = generateSalemCardType("Conspiracy_BLACK", 1);
    let nightCard = generateSalemCardType("Night_BLACK", 1);

    // Add conspiracy
    //salemDeck.push(...conspiracyCard);
   
    salemDeck = ctx.random.Shuffle(salemDeck);
    salemDeck[salemDeck.length - 2] = conspiracyCard[0];

    //Add night to bottom
    salemDeck.unshift(...nightCard);

    return {
      nightVotes: {},
      hasCheckedBlackCatForConspiracy: false,
      playersConfessed: [],
      playerState,
      salemDeck,
      salemDiscard: [],
      alivePlayers,
    };
  },
  moves: {
    play() {},
  },

  phases: {
    dawn: {
      endIf: (G, ctx) => {
        let totalVotes = 0;
        for (let playerId in G.dawnVotes) {
          totalVotes += G.dawnVotes[playerId];
        }

        let numWitches = 0;

        for (let playerId in G.playerState) {
          if (G.playerState[playerId].isWitch === true) {
            numWitches++;
          }
        }

        if (totalVotes === numWitches) {
          return true;
        }

        return false;
      },
      onEnd: (G, ctx) => {
        let playersWithVotes = [];
        for (let playerId in G.dawnVotes) {
          playersWithVotes.push(playerId);
        }

        let playerToAssignBlackCat;

        if (playersWithVotes.length > 1) {
          playerToAssignBlackCat =
            playersWithVotes[ctx.random.Die(playersWithVotes.length) - 1];
        } else {
          playerToAssignBlackCat = playersWithVotes[0];
        }
        let blackCatCard = generateSalemCardType("Blackcat_BLUE", 1);
        playCardOnPlayer(G, ctx, blackCatCard[0], playerToAssignBlackCat);
      },
      onBegin: (G, ctx) => {
        G.dawnVotes = {};
      },
      moves: {
        voteBlackCat(G, ctx, playerId) {
          if (G.dawnVotes[playerId] === undefined) {
            G.dawnVotes[playerId] = 1;
          } else {
            G.dawnVotes[playerId]++;
          }
        },
      },
      start: true,
      next: "mainGame",

      turn: {
        order: {
          first: (G, ctx) => {
            return 0;
          },
          next: (G, ctx) => {
            return ctx.playOrderPos + 1;
          },

          playOrder: (G, ctx) => {
            let witches = [];
            for (let playerId = 0; playerId < ctx.numPlayers; playerId++) {
              if (G.playerState[playerId].isWitch) {
                witches.push(playerId);
              }
            }
            return witches;
          },
        },
      },
    },
    mainGame: {
      turn: {
        order: {
          first: (G, ctx) => 0,
          next: (G, ctx) => {
            let currentPlayer = ctx.currentPlayer;

            let foundIndex;
            for(let i = 0; i< G.alivePlayers.length; i++) {
              let player = G.alivePlayers[i];
              if(player === currentPlayer) {
                foundIndex = i;
              }
            }

            let nextPlayer = G.alivePlayers[foundIndex + 1];
            if (nextPlayer === undefined) {
              nextPlayer = G.alivePlayers[0];
            }

            let nextPlayerIndex;
            for(let i = 0; i < ctx.playOrder.length; i++) {
              let playerId = ctx.playOrder[i];
              if(playerId === nextPlayer) {
                nextPlayerIndex = i;
              }
            }

            if(nextPlayerIndex === undefined) {
              throw new Error("Can't find next player");
            }

            return nextPlayerIndex
          }
        },
        onBegin: (G, ctx) => {
          G.drawnCardsThisTurn = 0;
          G.playedCardsThisTurn = 0;

          return G;
        },

        endIf: (G, ctx) => {
          let shouldReturn = false;
          if (G.drawnCardsThisTurn === 2) {
            shouldReturn = true;
          }

          return shouldReturn;

        },
        onEnd: (G, ctx) => {
          removeCardTypeFromPlayer(G, ctx, "STOCKS", ctx.currentPlayer);
        },

        onMove: (G, ctx) => {
          let currentPlayerState = getCurrentPlayerState(G, ctx);
          let hand = currentPlayerState.hand;

          if (!G.isNight && !G.isConspiracy) {
            let newHand = [];
            for (let card of hand) {
              
              if (card.type === "CONSPIRACY") {

                if(G.hasCheckedBlackCatForConspiracy === false) {
                  for(let player of G.alivePlayers) {
                    if(hasCardAgainst(G, ctx, "BLACKCAT", player)) {
                      G.blackCatTryal = true;
                      G.hasCheckedBlackCatForConspiracy = true;
                      ctx.events.setStage("tryal")
                      return;
                    }
                  }
                }



                  let playersToTakeToConspiracy = {};
                  for (let player of G.alivePlayers) {
                    playersToTakeToConspiracy[player] = "conspiracy";
                  }
  
                  removeCardFromPlayersHand(G, ctx, card, ctx.currentPlayer);
                  addCardToDiscardPile(G, ctx, card);
  
                  ctx.events.setActivePlayers({
                    value: playersToTakeToConspiracy,
                    moveLimit: 1
                  });
  
                  G.isConspiracy = true;
                  G.hasCheckedBlackCatForConspiracy = false;


              } else if (card.type === "NIGHT") {
                let playersToTakeToNight = {};
                let constableToTakeToNight = {};
                for (let player of G.alivePlayers) {
                  let playerState = getPlayerState(G, ctx, player);

                  if (playerState.isWitch) {
                    playersToTakeToNight[player] = {
                      stage: "nightWitch",
                      moveLimit: 1,
                    };
                  }

                  if (playerState.isConstable) {
                    constableToTakeToNight[player] = {
                      stage: "nightConstable",
                      moveLimit: 1,
                    };
                  }
                }

                removeCardFromPlayersHand(G, ctx, card, ctx.currentPlayer);
                addCardToDiscardPile(G, ctx, card, ctx.currentPlayer);

                ctx.events.setActivePlayers({
                  value: playersToTakeToNight,
                  next: {
                    value: constableToTakeToNight,
                    next: {
                      all: "nightTryal",
                      moveLimit: 1,
                    },
                  },
                });

                G.isNight = true;
              }
              else {
                newHand.push(card);
              }
            }
            currentPlayerState.hand = newHand;
          }
        },
        stages: {
          drawCards: {
            moves: {
              drawCard(G, ctx) {
                let cardDrawn = drawCardFromDeck(G, ctx);
                console.log(cardDrawn);
                G.drawnCardsThisTurn++;
              },
            },
          },
          playCards: {
            moves: {
              playCard(
                G,
                ctx,
                cardToPlay,
                player,
                targetPlayer,
                selectedTargetCards
              ) {
                removeCardFromCurrentPlayer(G, ctx, cardToPlay);
                playCardOnPlayer(
                  G,
                  ctx,
                  cardToPlay,
                  player,
                  targetPlayer,
                  selectedTargetCards
                );
                G.playedCardsThisTurn++;

                let totalAccusations = calculateAccusationsOnPlayer(
                  G,
                  ctx,
                  player
                );
                if (totalAccusations >= ACCUSATIONS_NEEDED_FOR_TRYAL) {
                  ctx.events.setStage("tryal");
                }
              },
            },
          },
          tryal: {
            moves: {
              selectTryalCard(G, ctx, tryalCardIndex, targetPlayer) {
                revealTryalCard(G, ctx, tryalCardIndex, targetPlayer);

                if (
                  isWitchRevealed(G, ctx, targetPlayer) ||
                  allTryalCardsRevealed(G, ctx, targetPlayer)
                ) {
                  killPlayer(G, ctx, targetPlayer);
                }

                if(G.blackCatTryal === true) {
                  G.blackCatTryal = false;
                }
                else {
                  ctx.events.setStage("playCards");
                  removeCardColourFromPlayer(G, ctx, "RED", targetPlayer);
                }

                updatePlayerRoles(G, ctx);
              },
            },
          },

          conspiracy: {
            moves: {
              pickedTryalCard(G, ctx, cardIndex) {
              
                  let playerID = ctx.playerID;
                  let alivePlayers = G.alivePlayers;
              
                  let foundIndex;
              
                  for(let i = 0; i < alivePlayers.length; i++) {
                    if(playerID === alivePlayers[i]) {
                      foundIndex = i;
                      break;
                    }
                  }
              
                  let indexOfNeighbour = foundIndex + 1;
                  if(indexOfNeighbour >= alivePlayers.length) {
                    indexOfNeighbour = 0;
                  }
              
                  let neighbourId = alivePlayers[indexOfNeighbour];
                  let neighbourPlayerState = getPlayerState(G, ctx, neighbourId);
                  let playerState = getPlayerState(G, ctx, playerID);
                  let tryalCards = playerState.tryalCards;

                  let neighbourTryalCards = neighbourPlayerState.tryalCards;

                  //let newTryalCards = [...tryalCards];
                  let newNeighbourTryalCards = [];

                  for(let i = 0; i < neighbourTryalCards.length; i++) {
                    if(i !== cardIndex) {
                      newNeighbourTryalCards.push(neighbourTryalCards[i]);
                    }
                    else {
                      playerState._pickedTryalCard = neighbourTryalCards[i];
                    }
                  }

                  neighbourPlayerState.tryalCards = newNeighbourTryalCards;
 

                  let isLastPersonToTakeCard = Object.keys(ctx.activePlayers).length === 1;
                  if (isLastPersonToTakeCard) {
                    for(let player of G.alivePlayers) {
                      let alivePlayerState = getPlayerState(G, ctx, player);
                      let newAlivePlayerTryalCards = [];
                      for(let card of alivePlayerState.tryalCards) {
                        if(card !== null) {
                          newAlivePlayerTryalCards.push(card);
                        }
                      }
                      newAlivePlayerTryalCards.push(alivePlayerState._pickedTryalCard);
                      alivePlayerState._pickedTryalCard = null;
                      alivePlayerState.tryalCards = ctx.random.Shuffle(newAlivePlayerTryalCards);

                      
                    }

                    updatePlayerRoles(G, ctx);
                    G.isConspiracy = false;

                    if(G.drawnCardsThisTurn === 1) {
                      ctx.events.setActivePlayers({value: {[ctx.currentPlayer]: "drawCards"}})
                    }
                  }
              }
            },
          },
          nightWitch: {
            moves: {
              voteKill(G, ctx, playerId) {
                if (G.nightVotes[playerId] === undefined) {
                  G.nightVotes[playerId] = 1;
                } else {
                  G.nightVotes[playerId]++;
                }
              },
            },
          },

          nightConstable: {
            moves: {
              savePlayer(G, ctx, playerId) {
                G.nightSave = playerId;
              },
            },
          },

          nightTryal: {
            moves: {
              confess(G, ctx, tryalCard) {
                let playerWhoMoved = ctx.playerID;
                let newPlayersConfessed = [...G.playersConfessed];

                if (tryalCard !== null) {
                  tryalCard.isRevealed = true;
                  newPlayersConfessed.push(playerWhoMoved);
                  G.playersConfessed = newPlayersConfessed;
                }

                let isLastPersonToConfess = Object.keys(ctx.activePlayers).length === 1;
                if (isLastPersonToConfess) {
                  let playersWithVotes = [];
                  for (let playerId in G.nightVotes) {
                    playersWithVotes.push(playerId);
                  }

                  let playerToKill;

                  if (playersWithVotes.length > 1) {
                    playerToKill =
                      playersWithVotes[
                        ctx.random.Die(playersWithVotes.length) - 1
                      ];
                  } else {
                    playerToKill = playersWithVotes[0];
                  }

                  let playerToSave = G.nightSave;

                  // Kill player who hasnt been saved

                  let playerDidConfess = G.playersConfessed.includes(playerToKill);

                  if (playerToSave !== playerToKill && !playerDidConfess && !hasCardAgainst(G, ctx, "ASYLUM", playerToKill)) {
                    killPlayer(G, ctx, playerToKill);
                  }

                  let playersToKill = [];
                  for(let player of G.alivePlayers) {
                    if (
                      isWitchRevealed(G, ctx, playerWhoMoved) ||
                      allTryalCardsRevealed(G, ctx, playerWhoMoved)
                    ) {
                      playersToKill.push(player);
                      
                    }
                  }

                  for(let player of playersToKill) {
                    killPlayer(G, ctx, player);
                  }

                  G.playersConfessed = [];
                  G.nightVotes = {};
                  G.nightSave = null;
                  G.isNight = false;

                  if(G.alivePlayers.includes(ctx.currentPlayer)) {
                    ctx.events.setActivePlayers({value: {[ctx.currentPlayer]:"drawCards" }});
                  }
                  else {
                    G.drawnCardsThisTurn = 0;
                    ctx.events.endTurn();
                  }
                }
              },
            },
          },
        },
      },
    },
  },
};


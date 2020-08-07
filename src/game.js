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
  updatePlayerRoles,
  findMetadata,
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
  if (G.salemDeck.length <= 0) {
    let newDeck = [];
    let nightCard = [];

    for (let card of G.salemDiscard) {
      if (card.type !== "NIGHT") {
        newDeck.push(card);
      } else {
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

function logMessage(G, ctx, message) {
  let newLogMessages = [...G.logMessages];

  newLogMessages.push(message);
  G.logMessages = newLogMessages;
}

function logWitchMessage(G, ctx, message) {
  logMessage(G, ctx, `WITCH: ${message}`);
}

function logPlayerMessage(G, ctx, message, playerId) {
  logMessage(G, ctx, `PRIVATE_${playerId}: ${message}`);
}

export function getIdentifierString(G, ctx, gameMetadata, playerId) {
  let identifierString = `${getPlayerState(G, ctx, playerId).character} (${
    findMetadata(
      G,

      ctx,
      gameMetadata,
      playerId
    ).name
  })`;

  return identifierString;
}

function witchesWin(G, ctx) {
  let witchesWin = true;
  for (let player of G.alivePlayers) {
    let playerState = getPlayerState(G, ctx, player);
    if (playerState.isWitch !== true) {
      witchesWin = false;
      break;
    }
  }

  return witchesWin;
}

function townsPeopleWin(G, ctx) {
  let townsPeopleWin = true;
  for (let player of G.alivePlayers) {
    let playerState = getPlayerState(G, ctx, player);

    for (let tryalCard of playerState.tryalCards) {
      if (tryalCard.type === "WITCH" && tryalCard.isRevealed !== true) {
        townsPeopleWin = false;
        break;
      }
    }
  }

  return townsPeopleWin;
}

export const Salem = {
  minPlayers: 4,
  maxPlayers: 12,
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

    let logMessages = [];

    // Assign witch cards
    while (witchDeck.length > 0) {
      for (let player of alivePlayers) {
        let cardToAdd = witchDeck.pop();

        if (cardToAdd.type === "WITCH") {
          playerState[player].isWitch = true;
          logMessages.push(
            `WITCH: ${playerState[player].character} is a witch!`
          );
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
    salemDeck.push(...conspiracyCard);

    salemDeck = ctx.random.Shuffle(salemDeck);

    //Add night to bottom
    salemDeck.unshift(...nightCard);
    //salemDeck.push(...nightCard);

    return {
      nightVotes: {},
      hasCheckedBlackCatForConspiracy: false,
      playersConfessed: [],
      playerState,
      salemDeck,
      salemDiscard: [],
      alivePlayers,
      logMessages: logMessages,
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
        logMessage(
          G,
          ctx,
          `The witches have given ${
            getPlayerState(G, ctx, playerToAssignBlackCat).character
          } the black cat!`
        );
      },
      onBegin: (G, ctx) => {
        G.dawnVotes = {};
      },
      moves: {
        voteBlackCat(G, ctx, playerId, meta) {
          if (G.dawnVotes[playerId] === undefined) {
            G.dawnVotes[playerId] = 1;
          } else {
            G.dawnVotes[playerId]++;
          }

          logWitchMessage(
            G,
            ctx,
            `${getIdentifierString(
              G,
              ctx,
              meta,
              playerId
            )} was given a vote for the blackcat by ${getIdentifierString(
              G,
              ctx,
              meta,
              ctx.currentPlayer
            )}!`
          );
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
            for (let i = 0; i < G.alivePlayers.length; i++) {
              let player = G.alivePlayers[i];
              if (player === currentPlayer) {
                foundIndex = i;
              }
            }

            let nextPlayer = G.alivePlayers[foundIndex + 1];
            if (nextPlayer === undefined) {
              nextPlayer = G.alivePlayers[0];
            }

            let nextPlayerIndex;
            for (let i = 0; i < ctx.playOrder.length; i++) {
              let playerId = ctx.playOrder[i];
              if (playerId === nextPlayer) {
                nextPlayerIndex = i;
              }
            }

            if (nextPlayerIndex === undefined) {
              throw new Error("Can't find next player");
            }

            return nextPlayerIndex;
          },
        },
        onBegin: (G, ctx) => {
          if (G.blackCatTryal !== true) {
            G.drawnCardsThisTurn = 0;
            G.playedCardsThisTurn = 0;
          }
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
                if (G.hasCheckedBlackCatForConspiracy === false) {
                  for (let player of G.alivePlayers) {
                    if (hasCardAgainst(G, ctx, "BLACKCAT", player)) {
                      G.blackCatTryal = true;
                      G.hasCheckedBlackCatForConspiracy = true;
                      ctx.events.setStage("tryal");
                      return;
                    }
                  }
                }
                setConspiracy(G, ctx, card);
              } else if (card.type === "NIGHT") {
                let foundConstable = false;
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
                    foundConstable = true;
                    constableToTakeToNight[player] = {
                      stage: "nightConstable",
                      moveLimit: 1,
                    };
                  }
                }

                removeCardFromPlayersHand(G, ctx, card, ctx.currentPlayer);
                addCardToDiscardPile(G, ctx, card, ctx.currentPlayer);

                logMessage(
                  G,
                  ctx,
                  "The night card was drawn so it's night time!"
                );

                if (foundConstable) {
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
                } else {
                  ctx.events.setActivePlayers({
                    value: playersToTakeToNight,
                    next: {
                      all: "nightTryal",
                      moveLimit: 1,
                    },
                  });
                }

                G.isNight = true;
              } else {
                newHand.push(card);
              }
            }
            currentPlayerState.hand = newHand;
          }
        },
        stages: {
          drawCards: {
            moves: {
              drawCard(G, ctx, meta) {
                let cardDrawn = drawCardFromDeck(G, ctx);
                logMessage(
                  G,
                  ctx,
                  `${getIdentifierString(
                    G,
                    ctx,
                    meta,
                    ctx.currentPlayer
                  )} has drawn a card...`
                );


                logPlayerMessage(G, ctx, `You drew a ${cardDrawn.type}`, ctx.currentPlayer);
                G.drawnCardsThisTurn++;

                logMessage(G, ctx, `There are ${G.salemDeck.length} cards left in the deck`
                )
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
                selectedTargetCards,
                meta
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

                logMessage(
                  G,
                  ctx,
                  generatePlayCardMessage(G, ctx, cardToPlay, player, targetPlayer, selectedTargetCards, meta)
                );
                G.playedCardsThisTurn++;

                let totalAccusations = calculateAccusationsOnPlayer(
                  G,
                  ctx,
                  player
                );
                if (totalAccusations >= ACCUSATIONS_NEEDED_FOR_TRYAL) {
                  logMessage(
                    G,
                    ctx,
                    `${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      player
                    )} has ${totalAccusations} accusations, it's time for a Tryal.`
                  );
                  ctx.events.setStage("tryal");
                }

                if (targetPlayer) {
                  let totalAccusationsOnTarget = calculateAccusationsOnPlayer(
                    G,
                    ctx,
                    targetPlayer
                  );

                  if (
                    totalAccusationsOnTarget >= ACCUSATIONS_NEEDED_FOR_TRYAL
                  ) {
                    logMessage(
                      G,
                      ctx,
                      `${getIdentifierString(
                        G,
                        ctx,
                        meta,
                        targetPlayer
                      )} has ${totalAccusations} accusations, it's time for a Tryal.`
                    );
                    ctx.events.setStage("tryal");
                  }
                }
              },
            },
          },
          tryal: {
            moves: {
              selectTryalCard(G, ctx, tryalCardIndex, targetPlayer, meta) {
                revealTryalCard(G, ctx, tryalCardIndex, targetPlayer);

                logMessage(
                  G,
                  ctx,
                  `${getIdentifierString(
                    G,
                    ctx,
                    meta,
                    ctx.playerID
                  )} revealed a tryal card of ${getIdentifierString(
                    G,
                    ctx,
                    meta,
                    targetPlayer
                  )}`
                );

                if (isWitchRevealed(G, ctx, targetPlayer)) {
                  killPlayer(G, ctx, targetPlayer);
                  logMessage(
                    G,
                    ctx,
                    `${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      targetPlayer
                    )} has been revealed as a witch!. They are now dead.`
                  );
                } else if (allTryalCardsRevealed(G, ctx, targetPlayer)) {
                  killPlayer(G, ctx, targetPlayer);
                  logMessage(
                    G,
                    ctx,
                    `${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      targetPlayer
                    )} had all their Tryal cards revealed!. They are now dead.`
                  );
                } else {
                  logMessage(
                    G,
                    ctx,
                    `The tryal card was a NOT card. They're safe, for now.`
                  );
                }

                if (G.blackCatTryal === true) {
                  G.blackCatTryal = false;

                  let conspiracyCard = null;
                  let hand = getPlayerState(G, ctx, ctx.playerID).hand;
                  for (let card of hand) {
                    if (card.type === "CONSPIRACY") {
                      conspiracyCard = card;
                    }
                  }

                  setConspiracy(G, ctx, conspiracyCard);
                } else {
                  ctx.events.setStage("playCards");
                  removeCardColourFromPlayer(G, ctx, "RED", targetPlayer);
                  logMessage(
                    G,
                    ctx,
                    `Removing red cards applied to ${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      targetPlayer
                    )}`
                  );
                }

                updatePlayerRoles(G, ctx);
              },
            },
          },

          conspiracy: {
            moves: {
              pickedTryalCard(G, ctx, cardIndex, meta) {
                let playerID = ctx.playerID;
                let alivePlayers = G.alivePlayers;

                let foundIndex;

                for (let i = 0; i < alivePlayers.length; i++) {
                  if (playerID === alivePlayers[i]) {
                    foundIndex = i;
                    break;
                  }
                }

                let indexOfNeighbour = foundIndex + 1;
                if (indexOfNeighbour >= alivePlayers.length) {
                  indexOfNeighbour = 0;
                }

                let neighbourId = alivePlayers[indexOfNeighbour];
                let neighbourPlayerState = getPlayerState(G, ctx, neighbourId);
                let playerState = getPlayerState(G, ctx, playerID);
                let tryalCards = playerState.tryalCards;

                let neighbourTryalCards = neighbourPlayerState.tryalCards;

                //let newTryalCards = [...tryalCards];
                let newNeighbourTryalCards = [];

                for (let i = 0; i < neighbourTryalCards.length; i++) {
                  if (i !== cardIndex) {
                    newNeighbourTryalCards.push(neighbourTryalCards[i]);
                  } else {
                    playerState._pickedTryalCard = neighbourTryalCards[i];
                  }
                }

                neighbourPlayerState.tryalCards = newNeighbourTryalCards;

                let isLastPersonToTakeCard =
                  Object.keys(ctx.activePlayers).length === 1;
                if (isLastPersonToTakeCard) {
                  for (let player of G.alivePlayers) {
                    let alivePlayerState = getPlayerState(G, ctx, player);
                    let newAlivePlayerTryalCards = [];
                    for (let card of alivePlayerState.tryalCards) {
                      if (card !== null) {
                        newAlivePlayerTryalCards.push(card);
                      }
                    }
                    newAlivePlayerTryalCards.push(
                      alivePlayerState._pickedTryalCard
                    );

                    logPlayerMessage(
                      G,
                      ctx,
                      `The Tryal Card you took was a ${alivePlayerState._pickedTryalCard.type} card!`,
                      player
                    );
                    alivePlayerState._pickedTryalCard = null;
                    alivePlayerState.tryalCards = ctx.random.Shuffle(
                      newAlivePlayerTryalCards
                    );
                  }

                  updatePlayerRoles(G, ctx);
                  G.isConspiracy = false;

                  if (G.drawnCardsThisTurn === 1) {
                    ctx.events.setActivePlayers({
                      value: { [ctx.currentPlayer]: "drawCards" },
                    });
                  }
                }
              },
            },
          },
          nightWitch: {
            moves: {
              voteKill(G, ctx, playerId, meta) {
                if (G.nightVotes[playerId] === undefined) {
                  G.nightVotes[playerId] = 1;
                } else {
                  G.nightVotes[playerId]++;
                }

                logWitchMessage(
                  G,
                  ctx,
                  `${getIdentifierString(
                    G,
                    ctx,
                    meta,
                    playerId
                  )} received a vote to be killed`
                );
              },
            },
          },

          nightConstable: {
            moves: {
              savePlayer(G, ctx, playerId, meta) {
                G.nightSave = playerId;
                logPlayerMessage(
                  G,
                  ctx,
                  `As the constable you voted to save ${getIdentifierString(
                    G,
                    ctx,
                    meta,
                    playerId
                  )}`,
                  ctx.playerID
                );
              },
            },
          },

          nightTryal: {
            moves: {
              confess(G, ctx, tryalCard, meta) {
                let playerWhoMoved = ctx.playerID;
                let newPlayersConfessed = [...G.playersConfessed];

                if (tryalCard !== null) {
                  tryalCard.isRevealed = true;
                  newPlayersConfessed.push(playerWhoMoved);
                  G.playersConfessed = newPlayersConfessed;
                  logMessage(
                    G,
                    ctx,
                    `${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      ctx.playerID
                    )} confessed revealing a ${tryalCard.type} card`
                  );
                }

                let isLastPersonToConfess =
                  Object.keys(ctx.activePlayers).length === 1;
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
                  logMessage(
                    G,
                    ctx,
                    `The witches tried to kill ${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      playerToKill
                    )}`
                  );
                  logMessage(
                    G,
                    ctx,
                    `The constable saved ${getIdentifierString(
                      G,
                      ctx,
                      meta,
                      playerToSave
                    )}`
                  );

                  // Kill player who hasnt been saved

                  let playerDidConfess = G.playersConfessed.includes(
                    playerToKill
                  );

                  if (
                    playerToSave !== playerToKill &&
                    !playerDidConfess &&
                    !hasCardAgainst(G, ctx, "ASYLUM", playerToKill)
                  ) {
                    logMessage(
                      G,
                      ctx,
                      `${getIdentifierString(
                        G,
                        ctx,
                        meta,
                        playerToKill
                      )} did not confess, so they are now dead`
                    );
                    killPlayer(G, ctx, playerToKill);
                  }

                  let playersToKill = [];
                  for (let player of G.alivePlayers) {
                    if (isWitchRevealed(G, ctx, playerWhoMoved)) {
                      playersToKill.push(player);
                      logMessage(
                        G,
                        ctx,
                        `${getIdentifierString(
                          G,
                          ctx,
                          meta,
                          player
                        )} revealed a witch card in confession, so they are now dead`
                      );
                    } else if (allTryalCardsRevealed(G, ctx, playerWhoMoved)) {
                      logMessage(
                        G,
                        ctx,
                        `${getIdentifierString(
                          G,
                          ctx,
                          meta,
                          player
                        )} revealed their last Tryal card, so they are now dead`
                      );
                      playersToKill.push(player);
                    }
                  }

                  for (let player of playersToKill) {
                    killPlayer(G, ctx, player);
                  }

                  G.playersConfessed = [];
                  G.nightVotes = {};
                  G.nightSave = null;
                  G.isNight = false;

                  if (G.alivePlayers.includes(ctx.currentPlayer)) {
                    ctx.events.setActivePlayers({
                      value: { [ctx.currentPlayer]: "drawCards" },
                    });
                  } else {
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

  endIf: (G, ctx) => {
    // All witch cards revealed
    if (townsPeopleWin(G, ctx)) {
      return { winner: "Townspeople" };
    }
    // Everyone alive is witch
    if (witchesWin(G, ctx)) {
      return { winner: "Witches" };
    }
  },
};

function setConspiracy(G, ctx, conspiracyCard) {
  logMessage(G, ctx, "The conspiracy card was drawn so it's a conspiracy!");
  let playersToTakeToConspiracy = {};
  for (let player of G.alivePlayers) {
    playersToTakeToConspiracy[player] = "conspiracy";
  }

  removeCardFromPlayersHand(G, ctx, conspiracyCard, ctx.currentPlayer);
  addCardToDiscardPile(G, ctx, conspiracyCard);

  ctx.events.setActivePlayers({
    value: playersToTakeToConspiracy,
    moveLimit: 1,
  });

  G.isConspiracy = true;
  G.hasCheckedBlackCatForConspiracy = false;
}

function generatePlayCardMessage(
  G, ctx,
  cardToPlay,
  player,
  targetPlayer,
  selectedTargetCards,
  meta
) {
  let message = "";

  try {
    let playerString = getIdentifierString(G, ctx, meta, ctx.currentPlayer);
    let idString = getIdentifierString(G, ctx, meta, player);
    if(cardToPlay.type === "SCAPEGOAT") {
      message = `${playerString} used SCAPEGOAT to take ${idString} and give them to ${getIdentifierString(G, ctx, meta, targetPlayer)}`
    }
    else if(cardToPlay.type === "CURSE") {
      message = `${playerString} used CURSE to take a blue card from ${idString} and give it to ${getIdentifierString(G, ctx, meta, targetPlayer)}`
    }
    else if(cardToPlay.type === "ROBBERY") {
      message = `${playerString} used ROBBERY to take the hand from ${idString} and give it to ${getIdentifierString(G, ctx, meta, targetPlayer)}`
    }
    else if(cardToPlay.type === "ARSON") {
      message = `${playerString} used ARSON to discard the hand of ${idString}`;
    }
    else if(cardToPlay.type === "ALIBI") {
      message = `${playerString} used ALIBI to discard ${selectedTargetCards.length} of ${idString}`
    }
    else {
      message = `${playerString} played ${cardToPlay.type} on ${getIdentifierString(G, ctx, meta, player)}`;
    }
  } catch (err) {
    console.error(err);
    message = `Played ${cardToPlay.type}`;
  }

  return message;
}

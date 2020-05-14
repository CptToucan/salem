import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Board from './Board';

import {
  Client
} from 'boardgame.io/react';

import { Local } from 'boardgame.io/multiplayer';
import { TurnOrder } from 'boardgame.io/core';
import update from 'immutability-helper';
import { removeCardFromCurrentPlayer, playCardOnPlayer, calculateAccusationsOnPlayer, hasCardAgainst, removeCardTypeFromPlayer } from './utils/playSalemCards';
import { getCurrentPlayerState, getPlayerStat } from './utils/getPlayerState';




function generateSalemCardType(title, numberOfCards = 0) {
  let cards = [];

  let cardIdParts = title.split("_");
  let cardTitle = cardIdParts[0];
  let cardColour = cardIdParts[1];

  for (let i = 0; i < numberOfCards; i++) {
    cards.push({
      id: `${cardTitle}-${i}`,
      title: `${cardTitle}`,
      type: cardTitle.toUpperCase(),
      colour: cardColour
    })
  }
  return cards;
}

const ACCUSATIONS_NEEDED_FOR_TRYAL = 7;

const CARDS_DEF = {
  "Accusation_RED": 35, //red
  "Evidence_RED": 5, // red
  "Witness_RED": 1, // red
  "Stocks_GREEN": 3, // green
  "Alibi_GREEN": 3, // green
  "Scapegoat_GREEN": 2, // green
  "Arson_GREEN": 1, // green
  "Robbery_GREEN": 1, // green
  "Curse_BLUE": 1, // blue 
  "Matchmaker_BLUE": 2, // blue
  "Asylum_BLUE": 1, // blue
  "Piety_BLUE": 1 // blue
}




const SETUPS = {
  4: {
    "not": 18,
    "witch": 1,
    "constable": 1
  },
  5: {
    "not": 23,
    "witch": 1,
    "constable": 1
  },
  6: {
    "not": 27,
    "witch": 2,
    "constable": 1
  },
  7: {
    "not": 32,
    "witch": 2,
    "constable": 1
  },
  8: {
    "not": 29,
    "witch": 2,
    "constable": 1
  },
  9: {
    "not": 33,
    "witch": 2,
    "constable": 1
  },
  10: {
    "not": 27,
    "witch": 2,
    "constable": 1
  },
  11: {
    "not": 30,
    "witch": 2,
    "constable": 1
  },
  12: {
    "not": 33,
    "witch": 2,
    "constable": 1
  }

}


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
  "Will Griggs"
]

function initializePlayers(numPlayers) {
  let defaultPlayers = {}
  for(let playerId = 0; playerId < numPlayers; playerId++) {
    defaultPlayers[playerId] = {
      isWitch: false,
      isConstable: false,
      character: "",
      hand: [],
      tryalCards: [],
      appliedBlueCards: [],
      appliedRedCards: [],
      appliedGreenCards: [],
    }
  }

  return defaultPlayers;
}

function drawCardFromDeck(G, ctx) {
  let cardToAssign = G.salemDeck.shift();
  let playerState = G.playerState;
  playerState[ctx.currentPlayer].hand.push(cardToAssign);
}

const Salem = {
  setup: (ctx) => {
    let salemDeck = [];
    for (let card in CARDS_DEF) {
      salemDeck = salemDeck.concat(generateSalemCardType(card, CARDS_DEF[card]))
    }

    let setupState = SETUPS[ctx.numPlayers];

    let witchCardDeck = [];

    for(let card in setupState) {
      witchCardDeck = witchCardDeck.concat(generateSalemCardType(card, setupState[card]))
    }

    salemDeck = ctx.random.Shuffle(salemDeck);
    let witchDeck = ctx.random.Shuffle(witchCardDeck);
    let characterDeck = ctx.random.Shuffle(CHARACTERS);

    let playerState = initializePlayers(ctx.numPlayers);

    // Assign characters
    for(let player of ctx.playOrder) {

      playerState[player].character = characterDeck.pop();
    }


    // Assign witch cards
    while(witchDeck.length > 0) {
      for(let player of ctx.playOrder) {
        let cardToAdd = witchDeck.pop();

        if(cardToAdd.type === "WITCH") {
          playerState[player].isWitch = true;
        }

        if(cardToAdd.type === "CONSTABLE") {
          playerState[player].isConstable = true;
        }

        playerState[player].tryalCards.push(cardToAdd);    
      }
    }

    // Assign hand
    for(let player of ctx.playOrder) {
      playerState[player].hand.push(salemDeck.pop());
      playerState[player].hand.push(salemDeck.pop());
      playerState[player].hand.push(salemDeck.pop());
    }


    let conspiracyCard = generateSalemCardType("Conspiracy_BLACK", 1);
    let nightCard = generateSalemCardType("Night_BLACK", 1);

    // Add conspiracy
    salemDeck = salemDeck.concat(conspiracyCard);
    salemDeck = ctx.random.Shuffle(salemDeck);

    //Add night to bottom
    salemDeck = salemDeck.concat(nightCard);

    return {
      playerState,
      salemDeck,
      salemDiscard: []
    };
  },
  moves: {
    play() {

    }
  },

  phases: {
    dawn: {
      endIf: (G, ctx) => {
        let totalVotes = 0;
        for(let playerId in G.dawnVotes) {
          totalVotes += G.dawnVotes[playerId]
        }

        let numWitches = 0;

        for(let playerId in G.playerState) {
          if(G.playerState[playerId].isWitch === true) {
            numWitches++;
          } 
        }

        

        if(totalVotes === numWitches) {
          return true
        }


        return false;
      },
      onEnd: (G, ctx) => {
        let playersWithVotes = [];
        for(let playerId in G.dawnVotes) {
          playersWithVotes.push(playerId);
        }

        let playerToAssignBlackCat;

        if(playersWithVotes.length > 1) {
          playerToAssignBlackCat = playersWithVotes[ctx.random.Die(playersWithVotes.length) - 1];
        }
        else {
          playerToAssignBlackCat = playersWithVotes[0];
        }
        let blackCatCard = generateSalemCardType("Blackcat_BLUE", 1);
        playCardOnPlayer(G, ctx, blackCatCard, playerToAssignBlackCat);

      },
      onBegin: (G, ctx) => {
        G.dawnVotes = {}
      },
      moves: {
        voteBlackCat(G, ctx, playerId) {
          if(G.dawnVotes[playerId] === undefined) {
            G.dawnVotes[playerId] = 1;
          }
          else {
            G.dawnVotes[playerId]++; 
          }
        
        }
      },
      start: true,
      next: "mainGame",

      turn: {
        order: {

          first: (G, ctx) => {return 0},
          next: (G, ctx) => {
           return ctx.playOrderPos + 1
          },

          playOrder: (G, ctx) => {
            let witches = [];
            for(let playerId = 0; playerId < ctx.numPlayers; playerId++) {
              if(G.playerState[playerId].isWitch) {
                witches.push(playerId);
              }
            }
            return witches;
          }
        }
      }

      
    },
    mainGame: {
      turn: {
        order: TurnOrder.RESET,
        onBegin: (G, ctx) => {
          G.drawnCardsThisTurn = 0;

          return G;
        },

        endIf: (G, ctx) => {
  
  

          if(G.drawnCardsThisTurn === 2) {
            return true;
          }
        },
        onEnd: (G, ctx) => {
          removeCardTypeFromPlayer(G, ctx, "STOCKS", ctx.currentPlayer);
        },
        stages: {
          drawCards: {
            moves: {
              drawCard(G, ctx) {
                drawCardFromDeck(G, ctx);
                G.drawnCardsThisTurn++;
              }
            }
          },
          playCards: {
            moves: {
              playCard(G, ctx, cardToPlay, targetPlayer) {
                removeCardFromCurrentPlayer(G, ctx, cardToPlay);
                playCardOnPlayer(G, ctx, cardToPlay, targetPlayer);
                let totalAccusations = calculateAccusationsOnPlayer(G, ctx, targetPlayer);
                console.log(totalAccusations);

                if(totalAccusations >= ACCUSATIONS_NEEDED_FOR_TRYAL) {
                  console.log("TRYAL STARTED");
                }
              }
            }
          },
          tryal: {
            moves: {
              selectTryalCard(G, ctx, selectedTryalCard, targetPlayer) {
                
              }
            }
          }
        }
      },

    }
  },

}




const SalemClient = Client({
  game: Salem,
  numPlayers: 8,
  board: Board,
  multiplayer: Local()
});

const App = () => (
  <div>
  <SalemClient playerID="0" />
  <SalemClient playerID="1" />
  <SalemClient playerID="2" />
  <SalemClient playerID="3" />
  <SalemClient playerID="4" />
  <SalemClient playerID="5" />
  <SalemClient playerID="6" />
  <SalemClient playerID="7" />
</div>
)





export default App;
/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

//export default App;
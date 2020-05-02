import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board';

import {
  Client
} from 'boardgame.io/react';

import { Local } from 'boardgame.io/multiplayer';
import { TurnOrder } from 'boardgame.io/core';




function generateSalemCardType(title, numberOfCards = 0) {
  let cards = [];

  for (let i = 0; i < numberOfCards; i++) {
    cards.push({
      id: `${title}-${i}`,
      title: `${title}`,
      type: title.toUpperCase()
    })
  }
  return cards;
}


const CARDS_DEF = {
  "Accusation": 35,
  "Evidence": 5,
  "Witness": 1,
  "Stocks": 3,
  "Alibi": 3,
  "Scapegoat": 2,
  "Arson": 1,
  "Robbery": 1,
  "Curse": 1,
  "Matchmaker": 2,
  "Asylum": 1,
  "Piety": 1
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
      appliedStatusCards: []
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


    let conspiracyCard = generateSalemCardType("Conspiracy", 1);
    let nightCard = generateSalemCardType("Night", 1);

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
        let blackCatCard = generateSalemCardType("Blackcat", 1);
        G.playerState[playerToAssignBlackCat].appliedStatusCards.push(blackCatCard);

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
          G.drawnCardsThisTurn = 0
          return G;
        },

        endIf: (G, ctx) => {
          if(G.drawnCardsThisTurn === 2) {
            return true;
          }
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
              playCard(G, ctx, cardToPlay) {
                
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
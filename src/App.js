import React from 'react';
import logo from './logo.svg';
import './App.css';
import Board from './Board';

import {
  Client
} from 'boardgame.io/react';

import { Local } from 'boardgame.io/multiplayer';



/*
const TicTacToe = {
  setup: () => ({ cells: Array(9).fill(null) }),

  moves: {
    clickCell: (G, ctx, id) => {
      if (G.cells[id] === null) {
        G.cells[id] = ctx.currentPlayer;
      }
    },
  },

  endIf: (G, ctx) => {
    if (IsVictory(G.cells)) {
      return { winner: ctx.currentPlayer };
    }
    if (IsDraw(G.cells)) {
      return { draw: true };
    }
  },
};
*/

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

/*
  "Blackcat": 1,
  "Night": 1,
  "Conspiracy": 1
*/

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

    let characterState = {};
    let witchHand = {};
    let handState = {};
    let witchState = {};
    let constableState = {};

    // Assign characters
    for(let player of ctx.playOrder) {
      characterState[player] = characterDeck.pop();
    }


    // Assign witch cards
    while(witchDeck.length > 0) {
      for(let player of ctx.playOrder) {
        let cardToAdd = witchDeck.pop();

        if(cardToAdd.type === "WITCH") {
          witchState[player] = true;
        }

        if(cardToAdd.type === "CONSTABLE") {
          constableState[player] = true;
        }

        
        if(witchHand[player] === undefined) {
          witchHand[player] = [cardToAdd]
        }
        else {
          witchHand[player].push(cardToAdd);
        }
      }
    }

    // Assign hand
    for(let player of ctx.playOrder) {
      handState[player] = [salemDeck.pop(), salemDeck.pop(), salemDeck.pop()];
    }


    let conspiracyCard = generateSalemCardType("Conspiracy", 1);
    let nightCard = generateSalemCardType("Night", 1);

    // Add conspiracy
    salemDeck = salemDeck.concat(conspiracyCard);
    salemDeck = ctx.random.Shuffle(salemDeck);

    //Add night to bottom
    salemDeck = salemDeck.concat(nightCard);

    return {
      characterState,
      witchHand,
      witchState,
      constableState,
      handState,
      salemDeck,
      salemDiscard: []
      //salemDeck,
      //witchDeck,
      //characterDeck
    };
  },

  phases: {
    dawn: {
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

      turn: {
        order: {

          first: (G, ctx) => 0,
          next: (G, ctx) => ctx.playerOrderPos + 1,

          playOrder: (G, ctx) => {
            let witches = [];
            for(let witch in G.witchState) {
              witches.push(witch);
            }
            return witches;
          }
        }
      }

      
    }
  },

}

const App = Client({
  game: Salem,
  numPlayers: 4,
  board: Board
  //multiplayer: Local()
});





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
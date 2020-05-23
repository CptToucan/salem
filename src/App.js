import React from "react";
import { render } from "react-dom";
import { Lobby } from 'boardgame.io/react';
import logo from "./logo.svg";
import "./App.scss";
import SalemBoard from "./board.js";

import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { Salem } from "./game";
import { SocketIO } from 'boardgame.io/multiplayer'

//const server = `https://${window.location.hostname}`;
const server = `http://192.168.0.51:8000`
const importedGames = [{ game: Salem, board: SalemBoard }];



/*
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
);
*/

/*
const SalemClient = Client({
  game: Salem,
  board: SalemBoard,
  multiplayer: Local(),
  numPlayers: 4
})
*/


class App extends React.Component {
  state = { playerID: null };

  
  render() {
    //let importedGames = [{game: Salem, board: SalemBoard}];
    return(
      <Lobby
      gameServer={server}
      lobbyServer={server}
      gameComponents={importedGames}
      refreshInterval={10000}
    />
      /*
    <Lobby
      gameServer={`http://192.168.0.51:8000`}
      lobbyServer={`http://192.168.0.51:8000`}
      gameComponents={importedGames}
    />
    */)
  }
  
}

render(<App />, document.getElementById("root"));




/*
const App = () => (
  <div>
    <SalemClient playerID="0" />
    <SalemClient playerID="1" />
    <SalemClient playerID="2" />
    <SalemClient playerID="3" />

  </div>
);
*/

/*
    <SalemClient playerID="4" />
    <SalemClient playerID="5" />
    <SalemClient playerID="6" />
    <SalemClient playerID="7" />*/
export default App;

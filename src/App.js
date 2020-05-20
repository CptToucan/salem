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

class App extends React.Component {
  state = { playerID: null };

  
  render() {
    let importedGames = [{game: Salem, board: SalemBoard}];
    return(<Lobby
      gameServer={`http://192.168.0.51:8000`}
      lobbyServer={`http://192.168.0.51:8000`}
      gameComponents={importedGames}
    />)
  }
  /*
  render() {
    if (this.state.playerID === null) {
      return (
        <div>
          <p>Play as</p>
          <button onClick={() => this.setState({ playerID: "0" })}>
            Player 0
          </button>
          <button onClick={() => this.setState({ playerID: "1" })}>
            Player 1
          </button>
          <button onClick={() => this.setState({ playerID: "2" })}>
            Player 2
          </button>
          <button onClick={() => this.setState({ playerID: "3" })}>
            Player 3
          </button>
          <button onClick={() => this.setState({ playerID: "4" })}>
            Player 4
          </button>
          <button onClick={() => this.setState({ playerID: "5" })}>
            Player 5
          </button>
          <button onClick={() => this.setState({ playerID: "6" })}>
            Player 6
          </button>
          <button onClick={() => this.setState({ playerID: "7" })}>
            Player 7
          </button>
          <button onClick={() => this.setState({ playerID: "8" })}>
            Player 8
          </button>
          <button onClick={() => this.setState({ playerID: "9" })}>
            Player 9
          </button>
          <button onClick={() => this.setState({ playerID: "10" })}>
            Player 10
          </button>
          <button onClick={() => this.setState({ playerID: "11" })}>
            Player 11
          </button>
          <button onClick={() => this.setState({ playerID: "12" })}>
            Player 12
          </button>
        </div>
      );
    }
    return (
      <div>
        <SalemClient playerID={this.state.playerID} />
      </div>
    );
  }
  */
}

render(<App />, document.getElementById("root"));

export default App;

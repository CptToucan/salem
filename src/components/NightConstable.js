import React from "react";
import Character from "./Character";
import { getPlayerState } from "../utils/player";

export default class NightConstable extends React.Component {
  selectedPlayer(playerId) {
    this.props.playerSelected(playerId);
  }

  render() {
    let characters = [];

    let alivePlayers = this.props.G.alivePlayers;
    const G = this.props.G;
    const ctx = this.props.ctx;
    const playerID = this.props.playerID;

    if (ctx.activePlayers[playerID]) {
      for (let playerId of alivePlayers) {
        let characterName = getPlayerState(G, ctx, playerId).character;
        if(playerId !== playerID) {

        }
        characters.push(
          <div key={characterName}>
            <Character
              key={characterName}
              character={characterName}
              onClick={() => this.selectedPlayer(playerId)}
            />
          </div>
        );
      }

      return <div> {characters} </div>;
    }
  }
}
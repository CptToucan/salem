import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./components/Character";
import PlayCard from "./components/PlayCard";

export default class SalemBoard extends React.Component {
  dawnClickPlayer(playerId) {
    this.props.moves.voteBlackCat(playerId);
    this.props.events.endTurn();
  }

  playCards() {
    this.props.events.setStage("playCards");
  }

  drawCards() {
    this.props.events.setStage("drawCards");
  }

  drawCard() {
    console.log(this.props.G);
    this.props.moves.drawCard();
  }

  playCard(card, playerId) {
    this.props.moves.playCard(card, playerId);
  }

  render() {
    if (this.props.ctx.phase === "dawn") {
      let characters = [];

      let isWitch = this.props.G.playerState[this.props.playerID].isWitch;

      if (isWitch) {
        if (this.props.playerID === this.props.ctx.currentPlayer) {
          for (
            let playerId = 0;
            playerId < this.props.ctx.numPlayers;
            playerId++
          ) {
            let characterName = this.props.G.playerState[playerId].character;
            let character = (
              <Character
                key={characterName}
                character={characterName}
                onClick={() => this.dawnClickPlayer(playerId)}
              />
            );
            characters.push(character);
          }

          return <div> {characters} </div>;
        } else {
          return <div> Your fellow witch is voting on the black cat... </div>;
        }
      } else {
        return <div>Dawn is taking place...</div>;
      }
    }

    if (this.props.ctx.phase === "mainGame") {
      if (this.props.playerID === this.props.ctx.currentPlayer) {
        if (this.props.ctx.activePlayers) {
          let stage = this.props.ctx.activePlayers[this.props.playerID];
          if (stage === "drawCards") {
            return (
              <div>
                <Button onClick={() => this.drawCard()}> Draw card</Button>
              </div>
            );
          } else if (stage === "playCards") {
            return (
              <PlayCard
                G={this.props.G}
                ctx={this.props.ctx}
                playerID={this.props.playerID}
                makeMove={(card, player) => {
                  this.playCard(card, player);
                }}
              />
            );
          }
        } else {
          return (
            <div>
              <Button onClick={() => this.playCards()}> Play cards</Button>
              <Button onClick={() => this.drawCards()}> Draw cards</Button>
            </div>
          );
        }
      } else {
        return <div>{this.props.ctx.currentPlayer} is playing </div>;
      }
    } else {
      return <div>Normal phase</div>;
    }
  }
}

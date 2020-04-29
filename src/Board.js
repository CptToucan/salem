import React from 'react';

export default class SalemBoard extends React.Component {

  dawnClickPlayer(playerId) {
    this.props.moves.voteBlackCat(playerId);
    this.props.events.endTurn();
  }

  playCards() {
    this.props.events.setStage('playCards');
  }

  drawCards() {
    this.props.events.setStage('drawCards');
  }

  drawCard() {
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
          for (let playerId = 0; playerId < this.props.ctx.numPlayers; playerId++) {
            let character = (< button key={
              playerId
            }
              onClick={
                () => this.dawnClickPlayer(playerId)
              } > {
                this.props.G.playerState[playerId].character
              } </button>);
            characters.push(character);
          }

          return (<div> {
            characters
          } </div>)
        }
        else {
          return (<div> Your fellow witch is voting on the black cat... </div>)
        }

      }
      else {
        return (<div>Dawn is taking place...</div>)
      }

    }

    if (this.props.ctx.phase === "mainGame") {
      if (this.props.playerID === this.props.ctx.currentPlayer) {


        if(this.props.ctx.activePlayers) {
          if(this.props.ctx.activePlayers[this.props.playerID] === "drawCards") {
            return (<div><button> Draw cards</button></div>)
          }
          else if(this.props.ctx.activePlayers[this.props.playerID] === "playCards") {
            return (<div>Playing cards</div>)
          }
        }
        else {
          return (<div><button onClick={() => this.playCards()} > Play cards</button> <button onClick={() => this.drawCards()} > Draw cards</button></div>)
        }


        
      }
      else {
        return (<div>{this.props.ctx.currentPlayer} is playing </div>)
      }
    }

    else {
      return (<div>Normal phase</div>)
    }
  }
}

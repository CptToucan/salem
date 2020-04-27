import React from 'react';

export default class SalemBoard extends React.Component {

dawnClickPlayer(playerId) {
  this.props.moves.voteBlackCat(playerId);
}

  render() {
    if (this.props.ctx.phase === "dawn") {
      let characters = [];

      console.log(this.props);
      for (let playerId = 0; playerId < this.props.ctx.numPlayers; playerId++) {
        let character = (< button key={
          playerId
        }
          onClick={
            () => this.dawnClickPlayer(playerId)
          } > {
            this.props.G.characterState[playerId]
          } </button>);
        characters.push(character);
      }

      return (<div> {
        characters
      } </div>)
    }
  }
}

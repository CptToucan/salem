import React from 'react';
import Button from '@material-ui/core/Button';

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
    console.log(this.props.G);
    this.props.moves.drawCard();
  }

  playCard(card, playerId) {
    this.props.moves.playCard(card, playerId);
  }

  renderOtherPlayers(playerID) {
    let playersToRender = [];
    for (let playerId of this.props.ctx.playOrder) {
      //this.props.G.playerState[playerId];

      if (playerId !== playerID) {
        playersToRender.push(<Button>{this.props.G.playerState[playerId].character}</Button>);
      }
    }
    return playersToRender;
  }

  renderCardsInHand(playerID) {
    let cardsInHand = this.props.G.playerState[playerID].hand;
    let cardsToRender = []
    for (let card of cardsInHand) {
      cardsToRender.push(
        <Button onClick={() => this.playCard(card)}>
          {card.title}
        </Button>
      )
    }
    return (<div>{cardsToRender}</div>)
  }

  render() {
    if (this.props.ctx.phase === "dawn") {
      let characters = [];

      let isWitch = this.props.G.playerState[this.props.playerID].isWitch;

      if (isWitch) {
        if (this.props.playerID === this.props.ctx.currentPlayer) {
          for (let playerId = 0; playerId < this.props.ctx.numPlayers; playerId++) {
            let character = (< Button key={
              playerId
            }
              onClick={
                () => this.dawnClickPlayer(playerId)
              } > {
                this.props.G.playerState[playerId].character
              } </Button>);
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


        if (this.props.ctx.activePlayers) {
          if (this.props.ctx.activePlayers[this.props.playerID] === "drawCards") {
            return (<div><Button onClick={() => this.drawCard()}> Draw card</Button></div>)
          }
          else if (this.props.ctx.activePlayers[this.props.playerID] === "playCards") {
            let cards = this.renderCardsInHand(this.props.playerID);
            let players = this.renderOtherPlayers(this.props.playerID);

            return (<div>{cards}{players}</div>)
          }
        }
        else {
          return (
            <div>
              <Button onClick={() => this.playCards()} > Play cards</Button>
              <Button onClick={() => this.drawCards()} > Draw cards</Button>
            </div>
            )
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

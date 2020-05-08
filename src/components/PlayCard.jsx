import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./Character";

export default class PlayCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCard: null, selectedPlayer: null };
  }

  selectCard(card) {
    this.setState({
      selectedCard: card,
    });
  }

  selectPlayer(player) {
    this.setState({
      selectedPlayer: player,
    });
  }

  confirmMove() {
    this.props.makeMove(this.state.selectedCard, this.state.selectedPlayer);
    this.resetState();
  }

  cancelMove() {
    this.resetState();
  }

  resetState() {
    this.setState({
      selectedCard: null,
      selectedPlayer: null
    })
  }

  renderOtherPlayers(playerID) {
    let playersToRender = [];
    for (let playerId of this.props.ctx.playOrder) {
      let character = this.props.G.playerState[playerId].character;
      //this.props.G.playerState[playerId];

      if (playerId !== playerID) {
        //playersToRender.push(<Button>{this.props.G.playerState[playerId].character}</Button>);
        playersToRender.push(
          <Character
            key={character}
            character={character}
            onClick={() => this.selectPlayer(playerId)}
          />
        );
      }
    }
    return playersToRender;
  }

  renderCardsInHand(playerID) {
    let cardsInHand = this.props.G.playerState[playerID].hand;
    let cardsToRender = [];
    for (let card of cardsInHand) {
      cardsToRender.push(
        <Button onClick={() => this.selectCard(card)}>{card.title}</Button>
      );
    }
    return <div>{cardsToRender}</div>;
  }

  render() {
    if (this.state.selectedCard === null) {
      return this.renderCardsInHand(this.props.playerID);
    } else if (this.state.selectedPlayer === null) {
      return this.renderOtherPlayers(this.props.playerID);
    } else {
      return (
        <div>
          Play {this.state.selectedCard.title} on {this.state.selectedPlayer}?
          <Button onClick={() => this.confirmMove()}>Confirm</Button><Button onClick={() => {this.cancelMove()}}>Cancel</Button>
        </div>
      );
    }
  }
}

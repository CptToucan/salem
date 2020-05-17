import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./Character";
import { getPlayerState } from "../utils/player";
import { calculateAccusationsOnPlayer } from "../utils/salem";

const ACCUSATIONS_NEEDED_FOR_TRYAL = 7;

export default class PlayCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCardIndex: null };
  }

  selectTryalCard(cardIndex) {
    this.setState({
      selectedCardIndex: cardIndex,
    });
  }

  selectPlayer(player) {
    this.setState({
      selectedPlayer: player,
    });
  }

  confirmMove() {
    this.props.selectTryalCard(this.state.selectedCardIndex, this.playerInTryal);
    this.resetState();
  }

  cancelMove() {
    this.resetState();
  }

  resetState() {
    this.setState({
      selectedCardIndex: null,
    })
  }

  renderTryalCards(numTryalCards) {
    let tryalCards = [];
    for(let i = 0; i < numTryalCards; i++) {
      tryalCards.push(<Button onClick={() => this.selectTryalCard(i)}>Tryal Card {i}</Button>);
    }
    return tryalCards;
  }

  render() {

    for (let playerId of this.props.G.alivePlayers) {
      if(calculateAccusationsOnPlayer(this.props.G, this.props.ctx, playerId) >= ACCUSATIONS_NEEDED_FOR_TRYAL){
        this.playerInTryal = playerId;
        break;
      }
    }
    if(this.state.selectedCardIndex === null) {
      return this.renderTryalCards(getPlayerState(this.props.G, this.props.ctx, this.playerInTryal).tryalCardCount);
    }
    else {
      return (
        <div>
          Reveal Tryal Card {this.state.selectedCardIndex} of {this.playerInTryal}
          <Button onClick={() => this.confirmMove()}>Confirm</Button><Button onClick={() => {this.cancelMove()}}>Cancel</Button>
        </div>
      )
    }
  }
}
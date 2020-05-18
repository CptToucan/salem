import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./Character";
import { getPlayerState } from "../utils/player";
import { calculateAccusationsOnPlayer, hasCardAgainst } from "../utils/salem";

const ACCUSATIONS_NEEDED_FOR_TRYAL = 7;

export default class Tryal extends React.Component {
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

  renderTryalCards(tryalCards) {
    let tryalCardsToRender = [];
    for(let i = 0; i < tryalCards.length; i++) {
      let card = tryalCards[i];
      if(card.isRevealed) {
        tryalCardsToRender.push(<Button>{card.title}</Button>)
      }
      else {
        tryalCardsToRender.push(<Button onClick={() => this.selectTryalCard(i)}>Tryal Card {i}</Button>);
      }
    }
    return tryalCardsToRender;
  }

  render() {

    if(this.props.G.blackCatTryal === true) {
      for (let playerId of this.props.G.alivePlayers) {
        if(hasCardAgainst(this.props.G, this.props.ctx, "BLACKCAT", playerId)) {
          this.playerInTryal = playerId;
        }
      }
    }
    else {
      for (let playerId of this.props.G.alivePlayers) {
      
        if(calculateAccusationsOnPlayer(this.props.G, this.props.ctx, playerId) >= ACCUSATIONS_NEEDED_FOR_TRYAL){
          this.playerInTryal = playerId;
          break;
        }
      }
    }

    if(this.state.selectedCardIndex === null) {
      return this.renderTryalCards(getPlayerState(this.props.G, this.props.ctx, this.playerInTryal).tryalCards);
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
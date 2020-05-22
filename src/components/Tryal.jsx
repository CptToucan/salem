import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./Character";
import { getPlayerState } from "../utils/player";
import { calculateAccusationsOnPlayer, hasCardAgainst } from "../utils/salem";
import Swiper from "react-id-swiper";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TryalView from "../TryalView";
import TryalCard from "./TryalCard";

const ACCUSATIONS_NEEDED_FOR_TRYAL = 1;

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

    const params = {
      centeredSlides: true,
      slidesPerView: 2
    };

    return (
      <div className="swiper-parent-container">
        <Swiper {...params}>
          {tryalCards.map((card, index) => (
            <div className="salem-card-swiper">
              <TryalCard card={card} show={card.isRevealed} onClick={(card, event) => {
                //event.stopPropagation()
                this.selectTryalCard(index);
              }} />
            </div>
          ))}
        </Swiper>
      </div>
    );
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
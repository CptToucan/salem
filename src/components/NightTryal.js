import React from "react";
import Character from "./Character";
import { getPlayerState } from "../utils/player";
import TryalCard from "./TryalCard";
import Button from "@material-ui/core/Button";
import Swiper from "react-id-swiper";

export default class NightTryal extends React.Component {
  confession(card) {
    this.props.confession(card);
  }

  /*
  renderTryalCards() {
    let playerState = getPlayerState(this.props.G, this.props.ctx, this.props.playerID);

    let tryalCards = playerState.tryalCards;
    let tryalCardsToRender = [];
   for(let tryalCard of tryalCards) {
    tryalCardsToRender.push(
      <TryalCard
        key={tryalCard.id}
        card={tryalCard}
        onClick={(card)=> {
          this.props.confession(card)
        }}
      />
    )
   }

   return tryalCardsToRender;
  }

  */
  renderTryalCards(tryalCards) {
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
                this.confession(card);
              }} />
            </div>
          ))}
        </Swiper>
      </div>
    );
  }

  render() {
    return (<div>
      Confess? Or brave judgement?
      {this.renderTryalCards(getPlayerState(this.props.G, this.props.ctx, this.props.playerID).tryalCards)}
      <Button onClick={() => (this.confession(null))}>
          Don't confess!
      </Button>
      
    </div>)

    
  }
}
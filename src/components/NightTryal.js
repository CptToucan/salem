import React from "react";
import Character from "./Character";
import { getPlayerState } from "../utils/player";
import TryalCard from "./TryalCard";
import Button from "@material-ui/core/Button";

export default class NightTryal extends React.Component {
  confession(card) {
    this.props.confession(card);
  }

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

  render() {
    return (<div>
      Confess? Or brave judgement?
      {this.renderTryalCards()}
      <Button onClick={() => (this.confession(null))}>
          Don't confess!
      </Button>
      
    </div>)

    
  }
}
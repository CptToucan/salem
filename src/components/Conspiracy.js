import React from 'react';
import { getPlayerState } from '../utils/player';
import TryalCard from "./TryalCard";
import Button from "@material-ui/core/Button";
export default class Conspiracy extends React.Component {

  selectTryalCard(cardIndex) {
    this.props.pickedTryal(cardIndex);
  }

  renderNeighbourTryalCards() {
    let G = this.props.G;
    let ctx = this.props.ctx;
    let playerID = this.props.playerID;
    let alivePlayers = G.alivePlayers;
    let tryalCardsToRender = [];

    let foundIndex;

    for(let i = 0; i < alivePlayers.length; i++) {
      if(playerID === alivePlayers[i]) {
        foundIndex = i;
        break;
      }
    }

    let indexOfNeighbour = foundIndex + 1;
    if(indexOfNeighbour >= alivePlayers.length) {
      indexOfNeighbour = 0;
    }

    let neighbourId = alivePlayers[indexOfNeighbour];
    let neighbourPlayerState = getPlayerState(G, ctx, neighbourId);

    let tryalCards = neighbourPlayerState.tryalCards;

    for(let i = 0; i < tryalCards.length; i++) {
      let tryalCard = tryalCards[i];
      if(tryalCard.isRevealed) {
        tryalCardsToRender.push(
          <TryalCard
            key={tryalCard.id}
            card={tryalCard}
            onClick={()=> {
            }}
          />
        )
      }
      else {
        tryalCardsToRender.push(
          <TryalCard
            key={tryalCard.id}
            card={tryalCard}
            onClick={()=> {
              this.selectTryalCard(i)
            }}
          />
        )
      }
 
     }

     return tryalCardsToRender;
    
  }

  
  render() {
    return (<div>
      It is a conspiracy...
      {this.renderNeighbourTryalCards()}
    </div>)
  }
}
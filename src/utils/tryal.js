import { removeCardFromCurrentPlayer, playCardOnPlayer, calculateAccusationsOnPlayer, hasCardAgainst, removeCardTypeFromPlayer } from './salem';
import { getCurrentPlayerState,  getPlayerState } from './player';

export function revealTryalCard(G, ctx, cardIndex, targetPlayer) {
  let playerState = getPlayerState(G, ctx, targetPlayer);
  let cardToReveal = playerState.tryalCards[cardIndex];

  let newTryalCards = [];
  let newRevealedTryalCards = [...playerState.revealedTryalCards];

  for(let card of playerState.tryalCards) {  
    if(cardToReveal === card) {
      newRevealedTryalCards.push(card)
    }
    else {
      newTryalCards.push(card);
    }
  }

  playerState.tryalCards = newTryalCards;
  playerState.revealedTryalCards = newRevealedTryalCards;
  
}


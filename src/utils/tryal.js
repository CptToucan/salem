import { removeCardFromCurrentPlayer, playCardOnPlayer, calculateAccusationsOnPlayer, hasCardAgainst, removeCardTypeFromPlayer } from './salem';
import { getCurrentPlayerState,  getPlayerState } from './player';

export function revealTryalCard(G, ctx, cardIndex, targetPlayer) {
  let playerState = getPlayerState(G, ctx, targetPlayer);
  let cardToReveal = playerState.tryalCards[cardIndex];
  let newTryalCards = [];

  for(let card of playerState.tryalCards) {

    if(cardToReveal.id === card.id) {
      card.isRevealed = true;
    }
    newTryalCards.push(card);
  }

  playerState.tryalCards = newTryalCards;
  
}


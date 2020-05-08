import { getCurrentPlayerState, getPlayerState } from "./getPlayerState";
import update from 'immutability-helper';

const RED_CARDS_VALUE = {
  "ACCUSATION": 1,
  "EVIDENCE": 3,
  "WITNESS": 7
}

export function playRed(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  targetPlayerState.appliedRedCards = update(targetPlayerState.appliedRedCards, {$push: [cardToPlay]})
  return targetPlayerState;
}

export function playBlue(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  targetPlayerState.appliedBlueCards = update(targetPlayerState.appliedBlueCards, {$push: [cardToPlay]})
  return targetPlayerState;
}

export function playGreen(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  targetPlayerState.appliedGreenCards = update(targetPlayerState.appliedGreenCards, {$push: [cardToPlay]})
  return targetPlayerState;
}

export function removeCardFromCurrentPlayer(G, ctx, cardToPlay) {
  let currentPlayerState = getCurrentPlayerState(G, ctx);
  let playersHand = currentPlayerState.hand;
  let foundIndex;
  for(let i = 0; i < playersHand.length; i++) {
    if(cardToPlay === playersHand[i]) {
      foundIndex = i;
    }
  }

  let newHand = update(currentPlayerState.hand, {$splice: [[foundIndex, 1]]});
  currentPlayerState.hand = newHand;
}
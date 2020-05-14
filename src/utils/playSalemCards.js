import { getCurrentPlayerState, getPlayerState } from "./getPlayerState";
import update from 'immutability-helper';

const RED_CARDS_VALUE = {
  "ACCUSATION": 1,
  "EVIDENCE": 3,
  "WITNESS": 7
}

export function playRed(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  let newRedAppliedCards = [...targetPlayerState.appliedRedCards];
  newRedAppliedCards.push(cardToPlay);
  targetPlayerState.appliedRedCards = newRedAppliedCards;
  return targetPlayerState;
}

export function playBlue(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  let newBlueAppliedCards = [...targetPlayerState.appliedBlueCards];
  newBlueAppliedCards.push(cardToPlay);
  targetPlayerState.appliedBlueCards = newBlueAppliedCards;
  return targetPlayerState;
}

export function playGreen(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  let newGreenAppliedCards = [...targetPlayerState.appliedGreenCards];
  newGreenAppliedCards.push(cardToPlay);
  targetPlayerState.appliedGreenCards = newGreenAppliedCards;
  return targetPlayerState;
}

export function getRedCardsAgainstPlayer(G, ctx, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  return targetPlayerState.appliedRedCards;
}

export function getBlueCardsAgainstPlayer(G, ctx, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  return targetPlayerState.appliedBlueCards;
}

export function getGreenCardsAgainstPlayer(G, ctx, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  return targetPlayerState.appliedGreenCards;
}

export function removeCardFromCurrentPlayer(G, ctx, cardToPlay) {
  let currentPlayerState = getCurrentPlayerState(G, ctx);
  let playersHand = currentPlayerState.hand;

  let newHand = []
  for(let card of playersHand) 
  {
    console.log(cardToPlay.id, card.id);
    if(cardToPlay.id !== card.id) {
      newHand.push(card);
    }
  }

  currentPlayerState.hand = newHand;
}

export function playCardOnPlayer(G, ctx, cardToPlay, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  if(cardToPlay.colour === "RED") {
    playRed(G, ctx, cardToPlay, targetPlayer);
  }
  else if(cardToPlay.colour === "BLUE") {
    playBlue(G, ctx, cardToPlay, targetPlayer);
  }
  else if(cardToPlay.colour === "GREEN") {
    playGreen(G, ctx, cardToPlay, targetPlayer);
  }

  

  return targetPlayerState;
}

export function calculateAccusationsOnPlayer(G, ctx, targetPlayer) {
  let redCards = getRedCardsAgainstPlayer(G, ctx, targetPlayer);

  let totalAccusationValue = 0;
  for(let card of redCards) {
    totalAccusationValue += RED_CARDS_VALUE[card.type];
  }

  return totalAccusationValue;

}

export function hasCardAgainst(G, ctx, cardType, targetPlayer) {
  for(let card of getRedCardsAgainstPlayer(G, ctx, targetPlayer)) {
    if(card.type === cardType) {
      return true;
    }
  }

  for(let card of getBlueCardsAgainstPlayer(G, ctx, targetPlayer)) {
    if(card.type === cardType) {
      return true;
    }
  }

  for(let card of getGreenCardsAgainstPlayer(G, ctx, targetPlayer)) {
    if(card.type === cardType) {
      return true;
    }
  }

  return false;
}

export function removeCardTypeFromPlayer(G, ctx, cardType, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);

  let newRedAppliedCards = [];
  for(let card of getRedCardsAgainstPlayer(G, ctx, targetPlayer)) {
    if(card.type !== cardType) {
      newRedAppliedCards.push(card);
    }
  }

  let newBlueAppliedCards = [];
  for(let card of getBlueCardsAgainstPlayer(G, ctx, targetPlayer)) {
    if(card.type !== cardType) {
      newBlueAppliedCards.push(card);
    }
  }

  let newGreenAppliedCards = [];
  for(let card of getGreenCardsAgainstPlayer(G, ctx, targetPlayer)) {
    if(card.type !== cardType) {
      newGreenAppliedCards.push(card);
    }
  }

  targetPlayerState.appliedRedCards = newRedAppliedCards;
  targetPlayerState.appliedBlueCards = newBlueAppliedCards;
  targetPlayerState.appliedGreenCards = newGreenAppliedCards;

  return targetPlayerState;
}
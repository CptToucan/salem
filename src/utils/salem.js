import { getCurrentPlayerState, getPlayerState } from "./player";
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

export function playGreen(G, ctx, cardToPlay, player, targetPlayer, selectedTargetCards) {
  let playerState = getPlayerState(G, ctx, player);
  let newGreenAppliedCards = [...playerState.appliedGreenCards];

  if(cardToPlay.type === "STOCKS") {
    newGreenAppliedCards.push(cardToPlay);
    playerState.appliedGreenCards = newGreenAppliedCards;
  }
  else if(cardToPlay.type === "ARSON") {
    discardPlayersHand(G, ctx, player);
    addCardToDiscardPile(G, ctx, cardToPlay);
  }
  else if(cardToPlay.type === "ALIBI") {
    for(let selectedCard of selectedTargetCards) {
      removeStatusCardFromPlayer(G, ctx, selectedCard, player);
      addCardToDiscardPile(G, ctx, selectedCard);
    }
    addCardToDiscardPile(G, ctx, cardToPlay);
  }
  else if(cardToPlay.type === "SCAPEGOAT") {
    let targetPlayerState = getPlayerState(G, ctx, targetPlayer);

    let newTargetAppliedBlueCards = [...targetPlayerState.appliedBlueCards, ...playerState.appliedBlueCards];
    let newTargetAppliedRedCards = [...targetPlayerState.appliedRedCards, ...playerState.appliedRedCards];
    let newTargetAppliedGreenCards = [...targetPlayerState.appliedGreenCards, ...playerState.appliedGreenCards];


    playerState.appliedBlueCards = [];
    playerState.appliedRedCards = [];
    playerState.appliedGreenCards = [];

    targetPlayerState.appliedBlueCards = newTargetAppliedBlueCards;
    targetPlayerState.appliedRedCards = newTargetAppliedRedCards;
    targetPlayerState.appliedGreenCards = newTargetAppliedGreenCards;


    addCardToDiscardPile(G, ctx, cardToPlay);
  }
  else if(cardToPlay.type === "ROBBERY") {
    let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
    let newTargetPlayerHand = [...targetPlayerState.hand, ...playerState.hand];
    let newSourcePlayerHand = [];

    playerState.hand = newSourcePlayerHand;
    targetPlayerState.hand = newTargetPlayerHand;
    addCardToDiscardPile(G, ctx, cardToPlay);
  }
  else if(cardToPlay.type === "CURSE") {
    removeStatusCardFromPlayer(G, ctx, selectedTargetCards[0], player);
    addCardToDiscardPile(G, ctx, cardToPlay);
    addCardToDiscardPile(G, ctx, selectedTargetCards[0]);
  }

  return playerState;
}

export function addCardToDiscardPile(G, ctx, card) {
  let newDiscardPile = [...G.salemDiscard];
  newDiscardPile.push(card);
  G.salemDiscard = newDiscardPile;
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
    if(cardToPlay.id !== card.id) {
      newHand.push(card);
    }
  }

  currentPlayerState.hand = newHand;
}

export function playCardOnPlayer(G, ctx, cardToPlay, player, targetPlayer, selectedTargetCards) {
  let playerState = getPlayerState(G, ctx, player,);
  if(cardToPlay.colour === "RED") {
    playRed(G, ctx, cardToPlay, player, targetPlayer, selectedTargetCards);
  }
  else if(cardToPlay.colour === "BLUE") {
    playBlue(G, ctx, cardToPlay, player, targetPlayer, selectedTargetCards);
  }
  else if(cardToPlay.colour === "GREEN") {
    playGreen(G, ctx, cardToPlay, player, targetPlayer, selectedTargetCards);
  }

  return playerState;
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

export function removeStatusCardFromPlayer(G, ctx, card, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);

  if(card.colour === "RED") {
    let newRedAppliedCards = [];
    for(let redCard of getRedCardsAgainstPlayer(G, ctx, targetPlayer)) {
      if(redCard.id !== card.id) {
        newRedAppliedCards.push(redCard);
      }
    }
    targetPlayerState.appliedRedCards = newRedAppliedCards;
  }
  else if(card.colour === "BLUE") {
    let newBlueAppliedCards = [];
    for(let blueCard of getBlueCardsAgainstPlayer(G, ctx, targetPlayer)) {
      if(blueCard.id !== card.id) {
        newBlueAppliedCards.push(blueCard);
      }
    }
    targetPlayerState.appliedBlueCards = newBlueAppliedCards;
  }
  else if(card.colour === "GREEN") {
    let newGreenAppliedCards = [];
    for(let greenCard of getGreenCardsAgainstPlayer(G, ctx, targetPlayer)) {
      if(greenCard.id !== card.id) {
        newGreenAppliedCards.push(greenCard);
      }
    }
    targetPlayerState.appliedGreenCards = newGreenAppliedCards;
  }
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

export function removeCardColourFromPlayer(G, ctx, cardColour, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);

  let newAppliedCards = [];

  if(cardColour === "RED") {
    targetPlayerState.appliedRedCards = newAppliedCards;
  }
  else if(cardColour === "BLUE") {
    targetPlayerState.appliedBlueCards = newAppliedCards;
  }
  else if(cardColour === "GREEN") {
    targetPlayerState.appliedGreenCards = newAppliedCards;
  }

  return targetPlayerState;
}

export function discardPlayersHand(G, ctx, targetPlayer) {
  let targetPlayerState = getPlayerState(G, ctx, targetPlayer);
  let handToDiscard = [...targetPlayerState.hand];
  let newDiscard = [...G.salemDiscard];
  newDiscard.push(...handToDiscard);
  targetPlayerState.hand = [];
}
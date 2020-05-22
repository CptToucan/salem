import { hasCardAgainst, addCardToDiscardPile } from './salem';

export function getCurrentPlayerState(G, ctx) {
  return getPlayerState(G, ctx, ctx.currentPlayer);
}

export function getPlayerState(G, ctx, playerId) {
  let playerState = G.playerState[playerId];
  return playerState;
}

export function isWitchRevealed(G, ctx, targetPlayer) {
  let playerState = getPlayerState(G, ctx, targetPlayer);
  let tryalCards = playerState.tryalCards;

  for(let card of tryalCards) {
    if(card.isRevealed && card.type === "WITCH") {
      return true
    }
  }
  return false;
}

export function allTryalCardsRevealed(G, ctx, targetPlayer) {
  let playerState = getPlayerState(G, ctx, targetPlayer);
  let tryalCards = playerState.tryalCards;

  let allTryalCardsRevealed = true;
  for(let card of tryalCards) {
    if(card.isRevealed === false) {
      allTryalCardsRevealed = false;
      break;
    }
  }

  return allTryalCardsRevealed;
}

export function killPlayer(G, ctx, targetPlayer) {
  let newAlivePlayers = [];

  let playersToKill = [targetPlayer];

  if(hasCardAgainst(G, ctx, "MATCHMAKER", targetPlayer)) {
    for(let alivePlayer of G.alivePlayers) {

      if(hasCardAgainst(G, ctx, "MATCHMAKER", alivePlayer)) {
        playersToKill.push(alivePlayer);
      }
    }
  }

  for(let alivePlayer of G.alivePlayers) {
    if(playersToKill.includes(alivePlayer)) {
      let playerState = getPlayerState(G, ctx, alivePlayer);
      playerState.isDead = true;
      let cardsForDiscard = [];


      cardsForDiscard.push(...playerState.appliedRedCards, ...playerState.appliedBlueCards, ...playerState.appliedGreenCards, ...playerState.hand);

      playerState.appliedRedCards = [];
      playerState.appliedBlueCards = [];
      playerState.appliedGreenCards = [];
      playerState.hand = [];

      for(let card of cardsForDiscard) {
        addCardToDiscardPile(G, ctx, card);
      }

    }
    else {
      newAlivePlayers.push(alivePlayer);
    }
  }

  G.alivePlayers = newAlivePlayers;
}

export function updatePlayerRoles(G, ctx) {

  for(let player of ctx.playOrder) {
    let playerState = getPlayerState(G, ctx, player);
    let tryalCards = playerState.tryalCards;
    let isConstable = false;
  
    for(let card of tryalCards) {
      if (card.type === "WITCH") {
        playerState.isWitch = true;
      }
  
      if (card.type === "CONSTABLE" && card.isRevealed === false) {
        isConstable = true;
      }
    }
  
    playerState.isConstable = isConstable;
  }

}

export function findMetadata(G, ctx, metaData, playerId) {
  if(metaData) {
    let foundGameMeta = metaData.find((playerElement) => {
      return `${playerElement.id}` === `${playerId}`;
    });
    return foundGameMeta
  }

  return {};
}
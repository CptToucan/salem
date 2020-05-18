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
  for(let alivePlayer of G.alivePlayers) {
    if(targetPlayer !== alivePlayer) {
      newAlivePlayers.push(alivePlayer);
    }
  }

  G.alivePlayers = newAlivePlayers;
}
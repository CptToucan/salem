export function getCurrentPlayerState(G, ctx) {
  return getPlayerState(G, ctx, ctx.currentPlayer);
}

export function getPlayerState(G, ctx, playerId) {
  let playerState = G.playerState[playerId];
  return playerState;
}
import React from "react";
import Character from "./Character";
import {
  getCurrentPlayerState,
  getPlayerState,
  findMetadata,
} from "../utils/player";
import Swiper from "react-id-swiper";
import { ViewOfOtherPlayer } from "../OtherPlayerView";

export default class Night extends React.Component {
  selectedPlayer(playerId) {
    this.props.playerSelected(playerId);
  }

  render() {
    const swiperParams = {
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1.2,
    };

    let alivePlayers = this.props.G.alivePlayers;
    let newAlivePlayers = [];
    for (let player of alivePlayers) {
      let foundGameMeta = findMetadata(
        this.props.G,
        this.props.ctx,
        this.props.gameMetadata,
        player
      );

      newAlivePlayers.push({ id: player, gameMeta: foundGameMeta });
    }

    return (
      <div class="view-width">
        Select a player to kill...
        <div class="player-swiper-container">
        <Swiper {...swiperParams}>
          {newAlivePlayers.map((playerElement) => (
            <div>
              <div className="other-player-swiper">
                <ViewOfOtherPlayer
                  ownPlayerId={this.props.playerID}
                  G={this.props.G}
                  ctx={this.props.ctx}
                  playerId={playerElement.id}
                  playerMeta={playerElement.gameMeta}
                  clickedPlayer={(playerId) => {
                    this.selectedPlayer(playerId);
                  }}
                />
              </div>
            </div>
          ))}
        </Swiper>
      </div>
      </div>
      
    );
  }
}

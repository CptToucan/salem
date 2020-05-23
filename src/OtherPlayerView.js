import React from "react";
import Swiper from "react-id-swiper";
import Character from "./components/Character";
import { getPlayerState, findMetadata } from "./utils/player";
import TryalCard from "./components/TryalCard";

export default class OtherPlayer extends React.Component {
  render() {
    const params = {
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1.2,
    };

    /**
     * effect: "coverflow",
     *       coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }, */
    //{...params}
    let alivePlayers = this.props.alivePlayers;
    let alivePlayersWithoutOwn = [];

    for (let player of alivePlayers) {
      if (player !== this.props.ownPlayerId) {
        let foundGameMeta = findMetadata(this.props.G, this.props.ctx, this.props.gameMeta, player);

        alivePlayersWithoutOwn.push({ id: player, gameMeta: foundGameMeta });
      }
    }

    return (
      <div class="swiper-parent-container">
        <Swiper {...params}>
          {alivePlayersWithoutOwn.map((playerElement) => (
            <div>
              <div className="other-player-swiper">
                <ViewOfOtherPlayer
                  G={this.props.G}
                  ctx={this.props.ctx}
                  playerId={playerElement.id}
                  playerMeta={playerElement.gameMeta}
                />
              </div>
            </div>
          ))}
        </Swiper>
      </div>
    );
  }
}

export class ViewOfOtherPlayer extends React.Component {
  clickedPlayer(playerId) {
    if(this.props.clickedPlayer) {
      this.props.clickedPlayer(playerId)
    }
  }
  render() {
    let playerState = getPlayerState(
      this.props.G,
      this.props.ctx,
      this.props.playerId
    );

    let allAppliedCards = [...playerState.appliedGreenCards, ...playerState.appliedRedCards, ...playerState.appliedBlueCards];
    
    let cardCount = {};
    for(let appliedCard of allAppliedCards) {
      if(cardCount[appliedCard.type] === undefined) {
        cardCount[appliedCard.type] = 1;
      }
      else {
        cardCount[appliedCard.type] = cardCount[appliedCard.type] + 1;
      }
    }
    let appliedCardsToRender = [];
    for(let type in cardCount) {
      appliedCardsToRender.push(
        <div>{type}: {cardCount[type]}</div>
      )
    }
    let playerName = this.props?.playerMeta?.name
    return (
      <button className="other-player-details" onClick={() => {this.clickedPlayer(this.props.playerId)}}>
        <div className="player-header">
          <h5>
            {playerName}
          </h5>

        </div>
        
        <Character character={playerState.character} />

        <div class="applied-salem-cards">
          {appliedCardsToRender}
        </div>

        <div class="tryal-card-container">
          {playerState.tryalCards.map((tryalCard) => {
            return <TryalCard card={tryalCard} onClick={() => {}} />;
          })}
        </div>
      </button>
    );
  }
}

/**
 *         {hand.map((card) => (
          <SalemCard card={card} />
        ))}
 */

/**
  *
  * 
  * 
  *           {hand.map((card) => (
            <div class="salem-card-swiper">
              <SalemCard card={card} cardClicked={() => {}} />
            </div>
          ))}
  * 
  *          {hand.map((card) => (
          <SalemCard card={card} cardClicked={()=>{}}/>
        ))}
               {hand.map((card) => (
          <SalemCard card={card} cardClicked={()=>{}} />
        ))}
  */

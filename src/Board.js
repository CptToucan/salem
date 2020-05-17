import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./components/Character";
import PlayCard from "./components/PlayCard";
import Tryal from "./components/Tryal";

  
/*
import PlayAsylum from './blue/PlayAsylum';
import PlayBlackCat from './blue/PlayBlackCat';
import PlayMatchmaker from './blue/PlayMatchmaker';
import PlayPiety from './blue/PlayPiety';

import PlayAlibi from './green/PlayAlibi';
import PlayArson from './green/PlayArson';
import PlayCurse from './green/PlayCurse';
import PlayRobbery from './green/PlayRobbery';
import PlayScapegoat from './green/PlayScapegoat';
import PlayStocks from './green/PlayStocks';

import PlayAccusation from './red/PlayAccusation';
import PlayEvidence from './red/PlayEvidence';
import PlayWitness from './red/PlayWitness';
*/

import {
  removeCardFromCurrentPlayer,
  playCardOnPlayer,
  calculateAccusationsOnPlayer,
  hasCardAgainst,
} from "./utils/salem";
import { getCurrentPlayerState, getPlayerState } from "./utils/player";



export default class SalemBoard extends React.Component {
  dawnClickPlayer(playerId) {
    this.props.moves.voteBlackCat(playerId);
    this.props.events.endTurn();
  }

  playCards() {
    this.props.events.setStage("playCards");
  }

  drawCards() {
    this.props.events.setStage("drawCards");
  }

  drawCard() {
    this.props.moves.drawCard();
  }

  playCard(card, playerId, targetPlayerId, selectedCards) {
    this.props.moves.playCard(card, playerId, targetPlayerId, selectedCards);
  }

  revealTryalCard(cardIndex, player) {
    this.props.moves.selectTryalCard(cardIndex, player);
  }

  render() {
    if (this.props.ctx.phase === "dawn") {
      let characters = [];

      let isWitch = this.props.G.playerState[this.props.playerID].isWitch;

      if (isWitch) {
        if (this.props.playerID === this.props.ctx.currentPlayer) {
          for (
            let playerId = 0;
            playerId < this.props.ctx.numPlayers;
            playerId++
          ) {
            let characterName = this.props.G.playerState[playerId].character;
            let character = (
              <Character
                key={characterName}
                character={characterName}
                onClick={() => this.dawnClickPlayer(playerId)}
              />
            );
            characters.push(character);
          }

          return <div> {characters} </div>;
        } else {
          return <div> Your fellow witch is voting on the black cat... </div>;
        }
      } else {
        return <div>Dawn is taking place...</div>;
      }
    }

    if (this.props.ctx.phase === "mainGame") {
      if (this.props.playerID === this.props.ctx.currentPlayer) {
        if (
          hasCardAgainst(
            this.props.G,
            this.props.ctx,
            "STOCKS",
            this.props.ctx.currentPlayer
          )
        ) {
          return (
            <div>
              <Button onClick={() => this.props.events.endTurn()}>
                End Turn
              </Button>
            </div>
          );
        }
        else if (this.props.ctx.activePlayers) {
          let stage = this.props.ctx.activePlayers[this.props.playerID];
          if (stage === "drawCards") {
            return (
              <div>
                <Button onClick={() => this.drawCard()}> Draw card</Button>
              </div>
            );
          } 
          else if (stage === "playCards") {
            return (
              <div>
                <PlayCard
                  G={this.props.G}
                  ctx={this.props.ctx}
                  playerID={this.props.playerID}
                  makeMove={(card, player, targetPlayer, selectedCards) => {
                    this.playCard(card, player, targetPlayer, selectedCards);
                  }}
                />
                <Button onClick={() => this.props.events.endTurn()}>
                  End Turn
                </Button>
              </div>
            );
          }
          else if (stage === "tryal") {
            return (
              <Tryal
              G={this.props.G}
              ctx={this.props.ctx}
              playerID={this.props.playerID}
              selectTryalCard={(cardIndex, player) => {
                this.revealTryalCard(cardIndex, player)
              }}
              />
            )
          }
        } else {
          return (
            <div>
              <Button onClick={() => this.playCards()}> Play cards</Button>
              <Button onClick={() => this.drawCards()}> Draw cards</Button>
            </div>
          );
        }
      } else {
        return <div>{this.props.ctx.currentPlayer} is playing </div>;
      }
    } else {
      return <div>Normal phase</div>;
    }
  }
}

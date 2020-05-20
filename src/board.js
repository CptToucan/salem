import React from "react";
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";
import Character from "./components/Character";
import PlayCard from "./components/PlayCard";
import Tryal from "./components/Tryal";
import Night from "./components/Night";
import NightConstable from "./components/NightConstable";
import NightTryal from "./components/NightTryal";
import Conspiracy from "./components/Conspiracy";

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
import PlayerView from "./PlayerView";

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

  witchSelectKill(player) {
    this.props.moves.voteKill(player);
  }

  constableSelectSave(player) {
    this.props.moves.savePlayer(player);
  }

  confession(tryalCard) {
    this.props.moves.confess(tryalCard);
  }

  pickedTryalCard(tryalCardIndex) {
    this.props.moves.pickedTryalCard(tryalCardIndex);
  }

  render() {

    let theme = createMuiTheme({
      palette: {
        type: "dark"
      }
    })
   return (
   <div>
     
     <ThemeProvider theme={theme}>
      <PlayerView G={this.props.G} ctx={this.props.ctx} playerID={this.props.playerID} turnStatus={"Dawn is taking place..."}/>
     </ThemeProvider>
   </div>)
  }
}


/** if (this.props.ctx.phase === "dawn") {
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
      if (
        this.props.ctx.activePlayers &&
        this.props.ctx.activePlayers[this.props.playerID]
      ) {
        let stage = this.props.ctx.activePlayers[this.props.playerID];
        if (stage === "drawCards") {
          return (
            <div>
              <Button onClick={() => this.drawCard()}> Draw card</Button>
            </div>
          );
        } else if (stage === "playCards") {
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
        } else if (stage === "tryal") {
          return (
            <Tryal
              G={this.props.G}
              ctx={this.props.ctx}
              playerID={this.props.playerID}
              selectTryalCard={(cardIndex, player) => {
                this.revealTryalCard(cardIndex, player);
              }}
            />
          );
        } else if (stage === "nightWitch") {
          return (
            <div>
              <Night
                G={this.props.G}
                ctx={this.props.ctx}
                playerID={this.props.playerID}
                playerSelected={(selectedPlayer) =>
                  this.witchSelectKill(selectedPlayer)
                }
              />
            </div>
          );
        } else if (stage === "nightConstable") {
          return (
            <div>
              <NightConstable
                G={this.props.G}
                ctx={this.props.ctx}
                playerID={this.props.playerID}
                playerSelected={(selectedPlayer) =>
                  this.constableSelectSave(selectedPlayer)
                }
              />
            </div>
          );
        } else if (stage === "nightTryal") {
          return (
            <div>
              <NightTryal
                G={this.props.G}
                ctx={this.props.ctx}
                playerID={this.props.playerID}
                confession={(tryalCard) => {this.confession(tryalCard)}}
              />
            </div>
          );
        } else if (stage === "conspiracy") {
          return (
            <div>
              <Conspiracy
                G={this.props.G}
                ctx={this.props.ctx}
                playerID={this.props.playerID}
                pickedTryal={(tryalCardIndex) => {this.pickedTryalCard(tryalCardIndex)}}
              />
            </div>
          );
        }
      } else if (this.props.G.isNight) {
        return <div>Night time, pray you're not next to die...</div>;
      }
      else if(this.props.G.isTryal) {
        return <div>A tryal is taking place...</div>
      }
      else if (this.props.G.isConspiracy) {
        return <div>The conspiracy is still taking place...</div>
      } else if (this.props.playerID === this.props.ctx.currentPlayer) {
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
        } else {
          return (
            <div>
              <Button onClick={() => this.playCards()}> Play cards</Button>
              <Button onClick={() => this.drawCards()}> Draw cards</Button>
            </div>
          );
        }
      } else if(this.props.G.alivePlayers.includes(this.props.playerID)) {
        return <div>{this.props.ctx.currentPlayer} is playing </div>;
      }
      else {
        return (<div>You're dead... bad luck</div>)
      }
    } else {
      return <div>Normal phase</div>;
    } */
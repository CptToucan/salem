import React from "react";
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { ViewOfOtherPlayer } from "./OtherPlayerView";
import Grid from "@material-ui/core/Grid";
import Swiper from "react-id-swiper";
import Button from "@material-ui/core/Button";
import Character from "./components/Character";
import PlayCard from "./components/PlayCard";
import Tryal from "./components/Tryal";
import Night from "./components/Night";
import NightConstable from "./components/NightConstable";
import NightTryal from "./components/NightTryal";
import Conspiracy from "./components/Conspiracy";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

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
import Backdrop from "@material-ui/core/Backdrop";
import {
  getCurrentPlayerState,
  getPlayerState,
  findMetadata,
} from "./utils/player";
import PlayerView from "./PlayerView";

const useStyles = (theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 2,
    color: "#fff",
  },

  playDrawButton: {
    width: "100%",
    minHeight: "30vw",
    marginBottom: "10px",
    backgroundColor: "#f8c63c",
    "&:active": {
      backgroundColor: "#e9d08c",
    },
    "&:hover": {
      backgroundColor: "#e9d08c",
    },
    "&:focus": {
      backgroundColor: "#e9d08c",
    },
  },
});

class SalemBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      turnDisplay: false,
    };
  }



  toggleTurnDisplay(isOpen) {
    this.setState({ ...this.state, turnDisplay: isOpen });
  }
  dawnClickPlayer(playerId) {
    this.props.moves.voteBlackCat(playerId, this.props.gameMetadata);
    this.toggleTurnDisplay(false);
    this.props.events.endTurn();
  }

  playCards() {
    this.props.events.setStage("playCards");
  }

  drawCards() {
    this.props.events.setStage("drawCards");
  }

  drawCard() {
    this.props.moves.drawCard(this.props.gameMetadata);
  }

  playCard(card, playerId, targetPlayerId, selectedCards) {
    this.props.moves.playCard(
      card,
      playerId,
      targetPlayerId,
      selectedCards,
      this.props.gameMetadata
    );
  }

  revealTryalCard(cardIndex, player) {
    this.props.moves.selectTryalCard(
      cardIndex,
      player,
      this.props.gameMetadata
    );
    this.toggleTurnDisplay(false);
  }

  witchSelectKill(player) {
    this.props.moves.voteKill(player, this.props.gameMetadata);
    this.toggleTurnDisplay(false);
  }

  constableSelectSave(player) {
    this.props.moves.savePlayer(player, this.props.gameMetadata);
    this.toggleTurnDisplay(false);
  }

  confession(tryalCard) {
    this.props.moves.confess(tryalCard, this.props.gameMetadata);
    this.toggleTurnDisplay(false);
  }

  pickedTryalCard(tryalCardIndex) {
    this.props.moves.pickedTryalCard(tryalCardIndex, this.props.gameMetadata);
    this.toggleTurnDisplay(false);
  }

  render() {
    let theme = createMuiTheme({
      palette: {
        type: "dark",
      },
    });

    const { classes } = this.props;

    if (this.props?.ctx?.gameover) {
      return <div>{this.props.ctx.gameover.winner} win!</div>;
    }

    return (
      <div>
        <ThemeProvider theme={theme}>
          <PlayerView
            gameMetadata={this.props.gameMetadata}
            G={this.props.G}
            ctx={this.props.ctx}
            playerID={this.props.playerID}
            turnStatus={"Dawn is taking place..."}
            isPlayerActive={this.props.isActive}
            clickedMakeMove={() => {
              this.toggleTurnDisplay(true);
            }}
          />
          <Backdrop className={classes.backdrop} open={this.state.turnDisplay}>
            <div class="close-backdrop">
              <IconButton
                aria-label="close"
                size="large"
                onClick={() => {
                  this.toggleTurnDisplay(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            </div>

            {this.renderTurn()}
          </Backdrop>
        </ThemeProvider>
      </div>
    );
  }

  /**         onClick={() => {
              this.toggleTurnDisplay(false);
            }} */

  renderTurn() {
    const { classes } = this.props;

    if (this.props.ctx.phase === "dawn") {
      let characters = [];

      const swiperParams = {
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1.2,
      };

      let isWitch = this.props.G.playerState[this.props.playerID].isWitch;

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

      if (isWitch && this.props.playerID === this.props.ctx.currentPlayer) {
        return (
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
                        this.dawnClickPlayer(playerId);
                      }}
                    />
                  </div>
                </div>
              ))}
            </Swiper>
          </div>
        );
      } else {
        return <div>You shouldn't see this...</div>;
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
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Button
                  className={classes.playDrawButton}
                  variant="contained"
                  size="large"
                  onClick={() => this.drawCard()}
                >
                  Draw card
                </Button>
              </Grid>
            </Grid>
          );
        } else if (stage === "playCards") {
          return (
            <div class="real-swiper-container">
              <PlayCard
                G={this.props.G}
                ctx={this.props.ctx}
                playerID={this.props.playerID}
                gameMetadata={this.props.gameMetadata}
                makeMove={(card, player, targetPlayer, selectedCards) => {
                  this.playCard(card, player, targetPlayer, selectedCards);
                }}
              />
              {this.props.G.playedCardsThisTurn > 0 && (
                <Button
                  className={classes.playDrawButton}
                  variant="contained"
                  size="large"
                  onClick={() => this.props.events.endTurn()}
                >
                  End Turn
                </Button>
              )}
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
            <Night
              G={this.props.G}
              ctx={this.props.ctx}
              playerID={this.props.playerID}
              playerSelected={(selectedPlayer) =>
                this.witchSelectKill(selectedPlayer)
              }
            />
          );
        } else if (stage === "nightConstable") {
          return (
            <NightConstable
              G={this.props.G}
              ctx={this.props.ctx}
              playerID={this.props.playerID}
              playerSelected={(selectedPlayer) =>
                this.constableSelectSave(selectedPlayer)
              }
            />
          );
        } else if (stage === "nightTryal") {
          return (
            <NightTryal
              G={this.props.G}
              ctx={this.props.ctx}
              playerID={this.props.playerID}
              confession={(tryalCard) => {
                this.confession(tryalCard);
              }}
            />
          );
        } else if (stage === "conspiracy") {
          return (
            <Conspiracy
              G={this.props.G}
              ctx={this.props.ctx}
              playerID={this.props.playerID}
              pickedTryal={(tryalCardIndex) => {
                this.pickedTryalCard(tryalCardIndex);
              }}
            />
          );
        }
      } else if (this.props.playerID === this.props.ctx.currentPlayer) {
        let playerState = getPlayerState(
          this.props.G,
          this.props.ctx,
          this.props.playerID
        );

        if (this.props.G.isConspiracy || this.props.G.blackCatTryal) {
          return <div>Your turn will start when the conspiracy is over!</div>;
        } else {
          return (
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Button
                  className={classes.playDrawButton}
                  variant="contained"
                  disabled={playerState.hand.length <= 0}
                  size="large"
                  onClick={() => this.playCards()}
                >
                  Play cards
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  className={classes.playDrawButton}
                  variant="contained"
                  size="large"
                  onClick={() => this.drawCards()}
                >
                  Draw cards
                </Button>
              </Grid>
            </Grid>
          );
        }
      }
    }
  }
}

export default withStyles(useStyles)(SalemBoard);

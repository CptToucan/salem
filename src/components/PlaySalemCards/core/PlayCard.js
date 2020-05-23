import React from "react";
import Button from "@material-ui/core/Button";
import Character from "../../Character";
import { getPlayerState, findMetadata } from "../../../utils/player";
import Swiper from "react-id-swiper";
import { ViewOfOtherPlayer } from "../../../OtherPlayerView";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const useStyles = (theme) => ({
  confirmButton: {
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

class PlayCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlayer: null,
      selectedTargetPlayer: null,
      selectedTargetCards: null,
    };
  }

  selectPlayer(player) {
    this.setState({
      selectedPlayer: player,
    });
  }

  selectTargetPlayer(player) {
    this.setState({
      selectedTargetPlayer: player,
    });
  }

  confirmOptions(selectedPlayer, selectedTargetPlayer, selectedTargetCards) {
    this.props.selectedCardOptions(
      selectedPlayer,
      selectedTargetPlayer,
      selectedTargetCards
    );
    this.resetState();
  }

cancelOptions() {
  this.resetState();    
  if (this.props.cancelMove) {
    this.props.cancelMove();
  }
  }

  resetState() {
    this.setState({
      selectedPlayer: null,
      selectedTargetPlayer: null,
      selectedTargetCards: [],
    });
  }

  renderOtherPlayers(...playerIds) {
    const swiperParams = {
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 1.2,
    };

    let alivePlayers = this.props.G.alivePlayers;
    let newAlivePlayers = [];
    for (let playerId of alivePlayers) {
      let foundGameMeta = findMetadata(
        this.props.G,
        this.props.ctx,
        this.props.gameMetadata
      );

      let playerInList = playerIds.find(function (player) {
        return playerId === player;
      });

      if (!playerInList) {
        newAlivePlayers.push({ id: playerId, gameMeta: foundGameMeta });
      }
    }

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
                    this.selectPlayer(playerId);
                  }}
                />
              </div>
            </div>
          ))}
        </Swiper>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    let selectedPlayer = this.state.selectedPlayer;

    if (selectedPlayer === null) {
      return this.renderOtherPlayers(this.props.playerID);
    } else if (selectedPlayer) {
      return (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            Play {this.props.cardTitle} on {" "}
            {
              getPlayerState(this.props.G, this.props.ctx, selectedPlayer)
                .character
            }{" "}
            (
            {
              findMetadata(
                this.props.G,
                this.props.ctx,
                this.props.gameMetadata,
                selectedPlayer
              ).name
            }
            )?
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.confirmButton}
              variant="contained"
              size="large"
              onClick={() => this.confirmOptions(selectedPlayer, null, null)}
            >
              Confirm
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.confirmButton}
              variant="contained"
              size="large"
              onClick={() => this.cancelOptions()}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      );
    }
  }
}

export default withStyles(useStyles)(PlayCard);
import PlayCard from "../core/PlayCard";
import React from "react";
import Character from "../../Character";
import { getPlayerState, findMetadata } from "../../../utils/player";
import Button from "@material-ui/core/Button";
import SalemCard from "../../SalemCard";
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

class PlayCurse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPlayer: null,
      selectedTargetPlayer: null,
      selectedTargetCards: [],
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

  selectTargetCard(card) {
    let selectedCards = [card];
    this.setState({
      selectedTargetCards: selectedCards,
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

  renderOtherPlayersWithBlueStatusCard(playerID) {
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

      if (playerId !== playerID) {
        let playerState = getPlayerState(
          this.props.G,
          this.props.ctx,
          playerId
        );
        if (playerState.appliedBlueCards.length > 0) {
          newAlivePlayers.push({ id: playerId, gameMeta: foundGameMeta });
        }
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

  renderBlueStatusCardsOfPlayer(player) {
    const params = {
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 30,
    };

    let playerState = getPlayerState(this.props.G, this.props.ctx, player);
    let blueCards = playerState.appliedBlueCards;
    let cardsToRender = [];
    for (let card of blueCards) {
      cardsToRender.push(
        card
      );
    }

    return (
      <div class="swiper-parent-container">
        <Swiper {...params}>
          {cardsToRender.map((card) => (
            <div class="salem-card-swiper">
              <SalemCard
                card={card}
                cardClicked={(card) => {
                  this.selectTargetCard(card);
                }}
              />
            </div>
          ))}
        </Swiper>
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    let selectedPlayer = this.state.selectedPlayer;
    let selectedTargetPlayer = this.state.selectedTargetPlayer;
    let selectedTargetCards = this.state.selectedTargetCards;
    if (selectedPlayer === null) {
      return this.renderOtherPlayersWithBlueStatusCard(this.props.playerID);
    } else if (selectedPlayer && selectedTargetCards.length <= 0) {
      return this.renderBlueStatusCardsOfPlayer(selectedPlayer);
    } else if (selectedPlayer && selectedTargetCards.length === 1) {
      return (
        <Grid container spacing={0}>
          <Grid item xs={12}>
            Remove {selectedTargetCards[0].title} from{" "}
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
              onClick={() =>
                this.confirmOptions(selectedPlayer, null, selectedTargetCards)
              }
            >
              Confirm
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              className={classes.confirmButton}
              variant="contained"
              size="large"
              onClick={() => {
                this.cancelOptions();
              }}
            >
              Cancel
            </Button>
          </Grid>
        </Grid>
      );
    }
  }
}

export default withStyles(useStyles)(PlayCurse);

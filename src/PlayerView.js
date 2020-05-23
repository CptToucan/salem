import React from "react";
import Grid from "@material-ui/core/Grid";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import TryalView from "./TryalView";
import OtherPlayerView from "./OtherPlayerView";
import AppliedCardsView from "./AppliedCardsView";
import CharacterView from "./CharacterView";
import HandView from "./HandView";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { getPlayerState } from "./utils/player";
import Backdrop from "@material-ui/core/Backdrop";
import Dialog from "@material-ui/core/Dialog";
import { getIdentifierString } from "./game";
import { animateScroll } from "react-scroll";

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  button: {
    flex: "1 1 0",
    margin: "5px",
    minHeight: "100px",
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
  drawerButton: {
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
  grid: {
    display: "flex",
  },
  parentGrid: {
    paddingTop: "30px",
  },
  drawer: {
    backgroundColor: "#1d0000",
  },
});

class PlayerView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bottom: false,
      showingTryal: false,
      showingCharacter: false,
      showingApplied: false,
      showingPlayers: false,
    };
  }

  componentDidMount() {
    this.scrollToBottom();
  }
  componentDidUpdate() {
    this.scrollToBottom();
  }
  scrollToBottom() {
    animateScroll.scrollToBottom({
      containerId: "log-messages",
    });
  }

  toggleDrawer(anchor, isOpen) {
    this.setState({ ...this.state, [anchor]: isOpen });
  }
  toggleTryal(isOpen) {
    this.setState({ ...this.state, showingTryal: isOpen });
  }
  toggleCharacter(isOpen) {
    this.setState({ ...this.state, showingCharacter: isOpen });
  }
  toggleApplied(isOpen) {
    this.setState({ ...this.state, showingApplied: isOpen });
  }
  toggleOthers(isOpen) {
    this.setState({ ...this.state, showingOthers: isOpen });
  }

  generateLogMessagesForTextArea() {
    let logMessages = this.props.G.logMessages;
    let logMessagesToShow = [];
    let playerState = getPlayerState(
      this.props.G,
      this.props.ctx,
      this.props.playerID
    );
    let isWitch = playerState.isWitch;

    for (let message of logMessages) {
      let shouldShow = false
      if (message.includes("WITCH:")) {
        if (isWitch) {
          shouldShow = true;
          logMessagesToShow.push(<div>{message}</div>);
        }
      }
      else if(message.includes(`${this.props.playerID}:`)) {
        shouldShow = true;
      }
      else if(!message.includes("PRIVATE_")) {
        shouldShow = true;
      }

      if(shouldShow) {
        logMessagesToShow.push(<div>{message}</div>);
      }
      
    
    }

    return logMessagesToShow;
  }

  renderDefaultPlayerView(bannerMessage) {
    const { classes } = this.props;
    let drawerAnchor = "bottom";

    let logMessages = this.generateLogMessagesForTextArea();
    let isPlayerDead = getPlayerState(this.props.G, this.props.ctx, this.props.playerID).isDead;

    return (
      <div className={classes.root}>
        <div className="turn-status">{bannerMessage}</div>
        <Grid container className={classes.parentGrid} spacing={0}>
          <Grid item className={classes.grid} xs={12}></Grid>
          <Grid item className={classes.grid} xs={12}>
            <div id="log-messages" className="log-messages" rows="10">
              {logMessages}
            </div>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              onClick={() => {
                this.toggleTryal(true);
              }}
            >
              Tryal
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              onClick={() => {
                this.toggleCharacter(true);
              }}
            >
              My Character
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={6}>
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              onClick={() => {
                this.toggleApplied(true);
              }}
            >
              Applied to Me
            </Button>
          </Grid>

          <Grid item className={classes.grid} xs={6}>
            <Button
              className={classes.button}
              variant="contained"
              size="large"
              onClick={() => {
                this.toggleOthers(true);
              }}
            >
              View Players
            </Button>
          </Grid>
          <Grid item className={classes.grid} xs={12}>
            <Button
              className={classes.button}
              disabled={!this.props.isPlayerActive || getPlayerState(this.props.G, this.props.ctx, this.props.playerID).isDead}
              variant="contained"
              size="large"
              onClick={() => {
                this.props.clickedMakeMove();
              }}
            >
              {isPlayerDead && "You are dead."}
              {!isPlayerDead && "Make a move"}
            </Button>
          </Grid>

          <Drawer
            anchor={drawerAnchor}
            open={this.state[drawerAnchor]}
            onClose={() => {
              this.toggleDrawer(drawerAnchor, false);
            }}
          >
            {this.state[drawerAnchor] && (
              <HandView
                hand={
                  getPlayerState(
                    this.props.G,
                    this.props.ctx,
                    this.props.playerID
                  ).hand
                }
              />
            )}
          </Drawer>

          <div className="open-salem-hand">
            <Button
              className={classes.drawerButton}
              onClick={() => {
                this.toggleDrawer(drawerAnchor, true);
              }}
            >
              <ExpandLessIcon />
            </Button>
          </div>
        </Grid>

        <Backdrop
          className={classes.backdrop}
          open={this.state.showingTryal}
          onClick={() => {
            this.toggleTryal(false);
          }}
        >
          {this.state.showingTryal && (
            <TryalView
              tryalCards={
                getPlayerState(
                  this.props.G,
                  this.props.ctx,
                  this.props.playerID
                ).tryalCards
              }
            />
          )}
        </Backdrop>
        <Backdrop
          className={classes.backdrop}
          open={this.state.showingCharacter}
          onClick={() => {
            this.toggleCharacter(false);
          }}
        >
          {this.state.showingCharacter && (
            <CharacterView
              playerState={getPlayerState(
                this.props.G,
                this.props.ctx,
                this.props.playerID
              )}
            />
          )}
        </Backdrop>
        <Backdrop
          className={classes.backdrop}
          open={this.state.showingApplied}
          onClick={() => {
            this.toggleApplied(false);
          }}
        >
          {this.state.showingApplied && (
            <AppliedCardsView
              playerState={getPlayerState(
                this.props.G,
                this.props.ctx,
                this.props.playerID
              )}
            />
          )}
        </Backdrop>
        <Backdrop
          className={classes.backdrop}
          open={this.state.showingOthers}
          onClick={() => {
            this.toggleOthers(false);
          }}
        >
          {this.state.showingOthers && (
            <OtherPlayerView
              G={this.props.G}
              ctx={this.props.ctx}
              ownPlayerId={this.props.playerID}
              alivePlayers={this.props.G.alivePlayers}
              allPlayerStates={this.props.G.playerState}
              gameMeta={this.props.gameMetadata}
            />
          )}
        </Backdrop>
      </div>
    );
  }
  render() {
    let G = this.props.G;
    let playerID = this.props.playerID;
    let ctx = this.props.ctx;
    let gameMeta = this.props.gameMetadata;
    let contentToRender = null;

    let isWitch = getPlayerState(G, ctx, playerID).isWitch;
    let bannerMessage;
    if (this.props.ctx.phase === "dawn") {
      bannerMessage = "Dawn is taking place...";
    }
    else if (this.props.ctx.phase === "mainGame") {

      if(G.isNight) {
        bannerMessage = "Night time..."
      }
      else if(G.isConspiracy) {
        bannerMessage = "Conspiracy..."
      }
      else {
        let foundIndex;
        let alivePlayers = G.alivePlayers;
        
        for(let i = 0; i < alivePlayers.length; i++) {
          if(ctx.currentPlayer === alivePlayers[i]) {
            foundIndex = i;
            break;
          }
        }
    
        let indexOfNeighbour = foundIndex + 1;
        if(indexOfNeighbour >= alivePlayers.length) {
          indexOfNeighbour = 0;
        }
        let nextPlayerId = alivePlayers[indexOfNeighbour];
  
        bannerMessage = `CURRENT: ${getIdentifierString(G, ctx, gameMeta, ctx.currentPlayer)} NEXT: ${getIdentifierString(G, ctx, gameMeta, nextPlayerId)}`
      }
      


    }

    return <div>{this.renderDefaultPlayerView(bannerMessage)}</div>;
  }
}
/**
 *         
 *      <Dialog fullScreen open={this.state.turnModal} onClose={()=> {}}>
        Test
      </Dialog>
 * 
 *   <SwipeableDrawer
      anchor={drawerAnchor}
      open={this.state[drawerAnchor]}
      onClose={() => {this.toggleDrawer(drawerAnchor, false)}}
      onOpen={() => {this.toggleDrawer(drawerAnchor, true)}}
    >
      TEST!
    </SwipeableDrawer>

    <Button onClick={() => {this.toggleDrawer(drawerAnchor, true)}}>^</Button>






<TryalView open={this.showingTryal}/>



 */

export default withStyles(useStyles)(PlayerView);

/**
 *       <div>
        <div class="turn-status">{this.props.turnStatus}</div>
        <div class="game-log"></div>
        <div class="detail-buttons">
          <button class="detail-button">
            Tryal
          </button>
          <button class="detail-button">
            My Character
          </button>
          <button class="detail-button">
            Applied to Me
          </button>
          <button class="detail-button">
            View Players
          </button>
        </div>
      </div>
 */

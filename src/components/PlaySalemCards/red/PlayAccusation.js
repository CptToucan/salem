import React from "react";
import Button from "@material-ui/core/Button";
import Character from "../../Character";
import { getPlayerState } from "../../../utils/player";
import { hasCardAgainst } from "../../../utils/salem";

export default class PlayAccusation extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedPlayer: null, selectedTargetPlayer: null, selectedTargetCards: null };
  }

  selectPlayer(player) {
    this.setState({
      selectedPlayer: player,
    });
  }

  selectTargetPlayer(player) {
    this.setState({
      selectedTargetPlayer: player
    })
  }

  confirmOptions(selectedPlayer, selectedTargetPlayer, selectedTargetCards) {
    this.props.selectedCardOptions(selectedPlayer, selectedTargetPlayer, selectedTargetCards);
    this.resetState();
  }

  cancelOptions() {
    this.resetState();
  }

  resetState() {
    this.setState({
      selectedPlayer: null,
      selectedTargetPlayer: null,
      selectedTargetCards: []
    })
  }

  renderOtherPlayers(...playerIds) {
    let playersToRender = [];
    for (let playerId of this.props.G.alivePlayers) {
      let character = getPlayerState(this.props.G, this.props.ctx, playerId).character;
      let playerInList = playerIds.find(function(player) {return playerId === player})
      if (!playerInList && !hasCardAgainst(this.props.G, this.props.ctx, "PIETY", playerId)) {
        playersToRender.push(
          <Character
            key={character}
            character={character}
            onClick={() => this.selectPlayer(playerId)}
          />
        );
      }
    }
    return playersToRender;
  }




  


  render() {
    let selectedPlayer = this.state.selectedPlayer;
    let selectedTargetPlayer = this.state.selectedTargetPlayer;
    let selectedTargetCards = this.state.selectedTargetCards;

    if(selectedPlayer === null) {
      return this.renderOtherPlayers(this.props.playerID);
    }

    else if(selectedPlayer) {
      return (
        <div>
          Play {this.props.cardTitle} on {selectedPlayer}?
          <Button onClick={() => this.confirmOptions(selectedPlayer, null, null)}>Confirm</Button><Button onClick={() => {this.cancelOptions()}}>Cancel</Button>
        </div>
      );
    }

  }
  
}

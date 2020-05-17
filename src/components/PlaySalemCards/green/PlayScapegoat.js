import PlayCard from "../core/PlayCard";
import React from "react";
import { getPlayerState } from '../../../utils/player';
import Button from "@material-ui/core/Button";
import Character from "../../Character";

export default class PlayRobbery extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedPlayer: null, selectedTargetPlayer: null, selectedTargetCards: null };
  }

  selectPlayer(player) {
    if(this.state.selectedPlayer === null) {
      this.setState({
        selectedPlayer: player
      });
    }
    else {
      this.setState({
        selectedTargetPlayer: player
      })
    }

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
      if (!playerInList) {
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

    if(selectedPlayer === null) {
      return (
        <div>
          Applied cards should you take?
          {this.renderOtherPlayers(this.props.playerID)}
        </div>
      )

      
    }
    else if(selectedTargetPlayer === null && selectedPlayer) {
      return (
        <div>
          Who should you give the applied cards to?
          {this.renderOtherPlayers(this.props.playerID, selectedPlayer)}
        </div>
      )
      
    }
    else {
      return (
        <div>
          Give {selectedPlayer}'s applied cards to {selectedTargetPlayer}?
          <Button onClick={() => this.confirmOptions(selectedPlayer, selectedTargetPlayer, null)}>Confirm</Button><Button onClick={() => {this.cancelOptions()}}>Cancel</Button>
        </div>
      );
    }


  }
}
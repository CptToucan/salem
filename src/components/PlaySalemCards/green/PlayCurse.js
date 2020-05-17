import PlayCard from "../core/PlayCard";
import React from "react";
import Character from "../../Character";
import { getPlayerState } from "../../../utils/player";
import Button from "@material-ui/core/Button";
import SalemCard from "../../SalemCard";


export default class PlayCurse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedPlayer: null, selectedTargetPlayer: null, selectedTargetCards: [] };
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

  selectTargetCard(card) {
    let selectedCards = [card];
    this.setState({
      selectedTargetCards: selectedCards
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

  renderOtherPlayersWithBlueStatusCard(playerID) {
    let playersToRender = [];
    for (let playerId of this.props.G.alivePlayers) {
      let character = this.props.G.playerState[playerId].character;

      if(playerId !== playerID) {
        let playerState = getPlayerState(this.props.G, this.props.ctx, playerId);
        if(playerState.appliedBlueCards.length > 0) {
          playersToRender.push(
            <Character
              key={character}
              character={character}
              onClick={() => this.selectPlayer(playerId)}
            />
          );
        }
      }
    }
    return playersToRender;
  }

  renderBlueStatusCardsOfPlayer(player) {
    let playerState = getPlayerState(this.props.G, this.props.ctx, player);
    let blueCards = playerState.appliedBlueCards;
    let cardsToRender = []
    for(let card of blueCards) {
      cardsToRender.push(<SalemCard cardClicked={(clickedCard) => {this.selectTargetCard(clickedCard)}} card={card}/>)
    }

    return cardsToRender;
  }

  render() {
    let selectedPlayer = this.state.selectedPlayer;
    let selectedTargetPlayer = this.state.selectedTargetPlayer;
    let selectedTargetCards = this.state.selectedTargetCards;
    console.log(selectedTargetCards);
    if(selectedPlayer === null) {
      return this.renderOtherPlayersWithBlueStatusCard(this.props.playerID);
    }
    else if(selectedPlayer && selectedTargetCards.length <= 0) {
      return this.renderBlueStatusCardsOfPlayer(selectedPlayer)
    }
    else if(selectedPlayer && selectedTargetCards.length === 1) {
      return (
        <div>
          Remove {selectedTargetCards[0].title} from {selectedPlayer}?
          <Button onClick={() => this.confirmOptions(selectedPlayer, null, selectedTargetCards)}>Confirm</Button><Button onClick={() => {this.cancelOptions()}}>Cancel</Button>
        </div>
      );
    }
  }
}
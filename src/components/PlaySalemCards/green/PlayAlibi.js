import PlayCard from "../core/PlayCard";
import React from "react";
import Character from "../../Character";
import { getPlayerState } from "../../../utils/player";
import Button from "@material-ui/core/Button";
import SalemCard from "../../SalemCard";

const MAX_ACCUSATION = 3;

export default class PlayAlibi extends React.Component {
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
    let selectedCards = [...this.state.selectedTargetCards];
    selectedCards.push(card);

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

  renderOtherPlayersWithAccusationCard(playerID) {
    let playersToRender = [];
    for (let playerId of this.props.G.alivePlayers) {
      let character = this.props.G.playerState[playerId].character;

      if(playerId !== playerID) {
        let playerState = getPlayerState(this.props.G, this.props.ctx, playerId);
        let redCards = playerState.appliedRedCards;

        for(let redCard of redCards) {
          if(redCard.type === "ACCUSATION") {
            playersToRender.push(
              <Character
                key={character}
                character={character}
                onClick={() => this.selectPlayer(playerId)}
              />
            );
            break;
          }
        }
      }
    }
    return playersToRender;
  }

  renderAccusationsOfPlayer(player) {
    let playerState = getPlayerState(this.props.G, this.props.ctx, player);
    let redCards = playerState.appliedRedCards;
    let cardsToRender = []
    for(let card of redCards) {
      if(card.type === "ACCUSATION") {
        let cardUsed = false;

        for(let usedCard of this.state.selectedTargetCards) {
          if(card.id === usedCard.id) {
            cardUsed = true;
            break;
          }
        }

        if(cardUsed === false) {
          cardsToRender.push(<SalemCard cardClicked={(clickedCard) => {this.selectTargetCard(clickedCard)}} card={card}/>)
        }        
      }
    }

    return cardsToRender;
  }

  render() {
    let selectedPlayer = this.state.selectedPlayer;
    let selectedTargetPlayer = this.state.selectedTargetPlayer;
    let selectedTargetCards = this.state.selectedTargetCards;
    console.log(selectedTargetCards);
    if(selectedPlayer === null) {
      return this.renderOtherPlayersWithAccusationCard(this.props.playerID);
    }
    else if(selectedPlayer && selectedTargetCards.length <= 0) {
      return this.renderAccusationsOfPlayer(selectedPlayer)
    }
    else if(selectedPlayer && selectedTargetCards.length > 0 && selectedTargetCards.length < MAX_ACCUSATION) {
      return (
        <div>
          Select more accusations?
          {this.renderAccusationsOfPlayer(selectedPlayer)}
          or discard {selectedTargetCards.length} Accusations from {selectedPlayer}?
          <Button onClick={() => this.confirmOptions(selectedPlayer, null, selectedTargetCards)}>Confirm</Button>
          <Button onClick={() => {this.cancelOptions()}}>Cancel</Button>
        </div>
      );

      //<Button onClick={() => this.confirmOptions(selectedPlayer, null, selectedTargetCards)}>Confirm</Button><Button onClick={() => {this.cancelOptions()}}>Cancel</Button>

    }
    else if(selectedPlayer && selectedTargetCards.length === MAX_ACCUSATION) {
      return (
        <div>
          Discard {selectedTargetCards.length} Accusations from {selectedPlayer}?
          <Button onClick={() => this.confirmOptions(selectedPlayer, null, selectedTargetCards)}>Confirm</Button>
          <Button onClick={() => {this.cancelOptions()}}>Cancel</Button>
        </div>
      );
    }
  }
}
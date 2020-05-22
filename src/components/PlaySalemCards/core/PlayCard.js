import React from "react";
import Button from "@material-ui/core/Button";
import Character from "../../Character";
import { getPlayerState } from "../../../utils/player";

export default class PlayCard extends React.Component {
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

/*
    constructor(props) {
      super(props);
      this.state = { selectedCard: null, selectedPlayer: null, selectedTargetPlayer: null };
    }

    selectCard(card) {
      this.setState({
        selectedCard: card,
      });
    }

    selectPlayer(player) {
      this.setState({
        selectedPlayer: player,
      });
    }

    selectedTargetPlayer(player) {
      this.setState({
        selectedTargetPlayer: player
      })
    }

    confirmMove(selectedCard, selectedPlayer, selectedTargetPlayer) {
      this.props.makeMove(selectedCard, selectedPlayer, selectedTargetPlayer);
      this.resetState();
    }

    cancelMove() {
      this.resetState();
    }

    resetState() {
      this.setState({
        selectedCard: null,
        selectedPlayer: null,
        selectedTargetPlayer: null
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

    renderOtherPlayersWithStatusCard(playerID) {
      let playersToRender = [];
      for (let playerId of this.props.G.alivePlayers) {
        let character = this.props.G.playerState[playerId].character;

        if(playerId !== playerID) {
          let playerState = getPlayerState(this.props.G, this.props.ctx, playerId);
          if(playerState.appliedRedCards.length > 0 || playerState.appliedBlueCards.length > 0 || playerState.appliedGreenCards.length > 0) {
            playersToRender.push(
              <Character
                key={character}
                character={character}
                onClick={() => this.selectPlayerForTarget(playerId)}
              />
            );
          }
        }
      }
      return playersToRender;
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
                onClick={() => this.selectPlayerForTarget(playerId)}
              />
            );
          }
        }
      }
      return playersToRender;
    }

    renderCardsInHand(playerID) {
      let cardsInHand = this.props.G.playerState[playerID].hand;
      let cardsToRender = [];
      for (let card of cardsInHand) {
        cardsToRender.push(
          <Button onClick={() => this.selectCard(card)}>{card.title}</Button>
        );
      }
      return <div>{cardsToRender}</div>;
    }

    render() {
      console.log(this.state.selectedCard);
      let selectedCard = this.state.selectedCard;
      let selectedPlayer = this.state.selectedPlayer;
      let selectedTargetPlayer = this.state.selectedTargetPlayer;

      if (selectedCard === null) {
        return this.renderCardsInHand(this.props.playerID);
      }

      else if(selectedCard.type === "SCAPEGOAT" && selectedPlayer === null) {
        return this.renderOtherPlayersWithStatusCard(this.props.playerID);
      }
      else if(selectedCard.type === "CURSE" && selectedPlayer === null) {
        return this.renderOtherPlayersWithBlueStatusCard(this.props.playerID);
      }
      
    
      else if (selectedPlayer === null) {
        return this.renderOtherPlayers(this.props.playerID);
      }
      
      else if(selectedCard.type === "ALIBI") {
        return this.renderOtherPlayers(this.props.playerID, this.state.selectedPlayer);
      }
      
      else if(selectedCard.type === "ROBBERY") {
        return this.renderOtherPlayers(this.props.playerID, this.state.selectedPlayer);
      }

      else if(selectedCard && selectedPlayer && selectedTargetPlayer) {
        return (
          <div>
          Take cards using {selectedCard.title} from {selectedPlayer} and give to {selectedTargetPlayer}?
          <Button onClick={() => this.confirmMove(selectedCard, selectedPlayer, selectedTargetPlayer)}>Confirm</Button><Button onClick={() => {this.cancelMove()}}>Cancel</Button>
        </div>
        )
      }

      else if(selectedCard && selectedPlayer && selectedTargetPlayer === null) {
        return (
          <div>
            Play {selectedCard.title} on {selectedPlayer}?
            <Button onClick={() => this.confirmMove(selectedCard, selectedPlayer)}>Confirm</Button><Button onClick={() => {this.cancelMove()}}>Cancel</Button>
          </div>
        );
      }
    }
  */

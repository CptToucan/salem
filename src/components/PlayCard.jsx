import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./Character";
import { getPlayerState } from "../utils/player";

import PlayAsylum from "./PlaySalemCards/blue/PlayAsylum";
import PlayBlackCat from "./PlaySalemCards/blue/PlayBlackCat";
import PlayMatchmaker from "./PlaySalemCards/blue/PlayMatchmaker";
import PlayPiety from "./PlaySalemCards/blue/PlayPiety";

import PlayAlibi from "./PlaySalemCards/green/PlayAlibi";
import PlayArson from "./PlaySalemCards/green/PlayArson";
import PlayCurse from "./PlaySalemCards/green/PlayCurse";
import PlayRobbery from "./PlaySalemCards/green/PlayRobbery";
import PlayScapegoat from "./PlaySalemCards/green/PlayScapegoat";
import PlayStocks from "./PlaySalemCards/green/PlayStocks";

import PlayAccusation from "./PlaySalemCards/red/PlayAccusation";
import PlayEvidence from "./PlaySalemCards/red/PlayEvidence";
import PlayWitness from "./PlaySalemCards/red/PlayWitness";

function humanize(str) {
  return str
    .replace(/^[\s_]+|[\s_]+$/g, "")
    .replace(/[_\s]+/g, " ")
    .replace(/^[a-z]/, function (m) {
      return m.toUpperCase();
    });
}

export default class PlayCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedCard: null };
  }

  selectCard(card) {
    this.setState({
      selectedCard: card,
    });
  }

  confirmMove(
    selectedCard,
    selectedPlayer,
    selectedTargetPlayer,
    selectedTargetCards
  ) {
    this.props.makeMove(
      selectedCard,
      selectedPlayer,
      selectedTargetPlayer,
      selectedTargetCards
    );
    this.resetState();
  }

  resetState() {
    this.setState({selectedCard: null})
  }

  cancelMove() {
    this.resetState();
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

  findPlayCardComponentForType(cardType) {
    /*
    let componentMap = {
      "ASYLUM": "PlayAsylum",
      "BLACKCAT": "PlayBlackCat",
      "MATCHMAKER": "PlayMatchmaker",
      "PIETY": "PlayPiety",
      "ALIBI": "PlayAlibi",
      "ARSON": "PlayArson",
      "CURSE": "PlayCurse",
      "ROBBERY": "PlayRobbery",
      "SCAPEGOAT": "PlayScapegoat",
      "STOCKS": "PlayStocks",
      "ACCUSATION": "PlayAccusation",
      "EVIDENCE": "PlayEvidence",
      "WITNESS": "PlayWitness"
    }
    */

    let componentMap = {
      ASYLUM: PlayAsylum,
      BLACKCAT: PlayBlackCat,
      MATCHMAKER: PlayMatchmaker,
      PIETY: PlayPiety,
      ALIBI: PlayAlibi,
      ARSON: PlayArson,
      CURSE: PlayCurse,
      ROBBERY: PlayRobbery,
      SCAPEGOAT: PlayScapegoat,
      STOCKS: PlayStocks,
      ACCUSATION: PlayAccusation,
      EVIDENCE: PlayEvidence,
      WITNESS: PlayWitness,
    };

    return componentMap[cardType];
  }

  render() {
    let selectedCard = this.state.selectedCard;

    if (selectedCard === null) {
      return this.renderCardsInHand(this.props.playerID);
    } else {
      let ComponentName = this.findPlayCardComponentForType(selectedCard.type);

      return (
        <ComponentName
          G={this.props.G}
          ctx={this.props.ctx}
          playerID={this.props.playerID}
          selectedCardOptions={(
            selectedPlayer,
            selectedTargetPlayer,
            selectedTargetCards
          ) => {
            this.confirmMove(
              selectedCard,
              selectedPlayer,
              selectedTargetPlayer,
              selectedTargetCards
            );
          }}
        />
      );
      /*
      return React.createElement(ComponentName, {
        selectedCardOptions: (
          selectedPlayer,
          selectedTargetPlayer,
          selectedTargetCards
        ) => {
          this.confirmMove(
            selectedCard,
            selectedPlayer,
            selectedTargetPlayer,
            selectedTargetCards
          );
        },
      });
      */
    }

    /*
    else if(selectedCard.type === "SCAPEGOAT" && selectedPlayer === null) {
      return this.renderOtherPlayersWithStatusCard(this.props.playerID);
    }
    else if(selectedCard.type === "CURSE" && selectedPlayer === null) {
      return this.renderOtherPlayersWithBlueStatusCard(this.props.playerID);
    }
    
  
    else if (selectedPlayer === null) {
      return this.renderOtherPlayers(this.props.playerID);
    }
    
    else if(selectedCard.type === "ALIBI" && selectedPlayer) {
      return this.renderOtherPlayers(this.props.playerID, selectedPlayer);
    }
    
    else if(selectedCard.type === "ROBBERY" && selectedPlayer) {
      return this.renderOtherPlayers(this.props.playerID, selectedPlayer);
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
    */
  }
}

/**
 *     if (selectedCard === null) {
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
 */

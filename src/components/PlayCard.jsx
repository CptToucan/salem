import React from "react";
import Button from "@material-ui/core/Button";
import Character from "./Character";
import { getPlayerState } from "../utils/player";

import SalemCard from "./SalemCard";

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

import HandView from "../HandView";

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
    
    return <HandView hand={cardsInHand} clickedCard={(cardClicked) => this.selectCard(cardClicked)}/>;
  }

  findPlayCardComponentForType(cardType) {
    const componentMap = {
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
    }
  }
}


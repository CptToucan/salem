import React from 'react';

export default class SalemCard extends React.Component {

  handleClick(card) {
    this.props.cardClicked(card);
  }

  findCardComponent(card) {
    const cardMap = {
      ASYLUM: {
        title: "ASYLUM",
        colour: "BLUE",
        description: "The player who is given Asylum can not be killed during the Night"
      },
      BLACKCAT: {
        title: "BLACK CAT",
        colour: "BLUE",
        description: "When a player draws Conspiracy, they reveal one Tryal card belonging to the player with the Black Cat"
      },
      MATCHMAKER: {
        title: "MATCHMAKER",
        colour: "BLUE",
        description: "When two players have the Matchmaker in front of them, if one dies, the other dies as well"
      },
      PIETY: {
        title: "PIETY",
        colour: "BLUE",
        description: "No red cards may be played on the player with Piety"
      },
      ALIBI: {
        title: "ALIBI",
        colour: "GREEN",
        description: "Discard up to three accusations that are currently in front of another player"
      },
      ARSON: {
        title: "ARSON",
        colour: "GREEN",
        description: "Discard all cards from the hand of any other player"
      },
      CURSE: {
        title: "CURSE",
        colour: "GREEN",
        description: "Discard one blue card that is currently in front of another player"
      },
      ROBBERY: {
        title: "ROBBERY",
        colour: "GREEN",
        description: "Take all cards from the hand of any other player and give them to another player"
      },
      SCAPEGOAT: {
        title: "SCAPEGOAT",
        colour: "GREEN",
        description: "Take all blue, green, and red cards in front of any other player and place them in front of another player"
      },
      STOCKS: {
        title: "STOCKS",
        colour: "GREEN",
        description: "The player who is given the Stocks will be skipped for their next turn"
      },
      ACCUSATION: {
        title: "ACCUSATION",
        colour: "RED",
        description: ""
      },
      EVIDENCE: {
        title: "EVIDENCE",
        colour: "RED",
        description: "Worth 3 accusations"
      },
      WITNESS: {
        title: "WITNESS",
        colour: "RED",
        description: "Worth 7 accusations"
      }
    }

    return cardMap[card.type];
  }

  render() {
    let cardDetails = this.findCardComponent(this.props.card);

    return (
      <button onClick={()=> {this.handleClick(this.props.card)}}>
        <h6>{cardDetails.title}</h6>
        <span>{cardDetails.description}</span>
        <span>{cardDetails.colour}</span>
      </button>
    )
  }
}
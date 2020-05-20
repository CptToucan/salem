import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faBurn,
  faMask,
  faMagic,
  faHorse,
  faBirthdayCake,
  faCross,
  faHospital,
  faHeart,
  faCat,
  faEye,
  faNewspaper,
  faHandPointRight,
  faMap,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";

export default class SalemCard extends React.Component {
  handleClick(card) {
    this.props.cardClicked(card);
  }

  findCardComponent(card) {
    const cardMap = {
      ASYLUM: {
        title: "ASYLUM",
        colour: "BLUE",
        description:
          "The player who is given Asylum can not be killed during the Night",
        icon: faHospital,
      },
      BLACKCAT: {
        title: "BLACK CAT",
        colour: "BLUE",
        description:
          "When a player draws Conspiracy, they reveal one Tryal card belonging to the player with the Black Cat",
        icon: faCat,
      },
      MATCHMAKER: {
        title: "MATCHMAKER",
        colour: "BLUE",
        description:
          "When two players have the Matchmaker in front of them, if one dies, the other dies as well",
        icon: faHeart,
      },
      PIETY: {
        title: "PIETY",
        colour: "BLUE",
        description: "No red cards may be played on the player with Piety",
        icon: faCross,
      },
      ALIBI: {
        title: "ALIBI",
        colour: "GREEN",
        description:
          "Discard up to three accusations that are currently in front of another player",
        icon: faBirthdayCake,
      },
      ARSON: {
        title: "ARSON",
        colour: "GREEN",
        description: "Discard all cards from the hand of any other player",
        icon: faBurn,
      },
      CURSE: {
        title: "CURSE",
        colour: "GREEN",
        description:
          "Discard one blue card that is currently in front of another player",
        icon: faMagic,
      },
      ROBBERY: {
        title: "ROBBERY",
        colour: "GREEN",
        description:
          "Take all cards from the hand of any other player and give them to another player",
        icon: faMask,
      },
      SCAPEGOAT: {
        title: "SCAPEGOAT",
        colour: "GREEN",
        description:
          "Take all blue, green, and red cards in front of any other player and place them in front of another player",
        icon: faHorse,
      },
      STOCKS: {
        title: "STOCKS",
        colour: "GREEN",
        description:
          "The player who is given the Stocks will be skipped for their next turn",
        icon: faBan,
      },
      ACCUSATION: {
        title: "ACCUSATION",
        colour: "RED",
        description: "",
        icon: faHandPointRight,
      },
      EVIDENCE: {
        title: "EVIDENCE",
        colour: "RED",
        description: "Worth 3 accusations",
        icon: faNewspaper,
      },
      WITNESS: {
        title: "WITNESS",
        colour: "RED",
        description: "Worth 7 accusations",
        icon: faEye,
      },
      CONSPIRACY: {
        title: "CONSPIRACY",
        colour: "BLACK",
        description: "Play immediately",
        icon: faMap,
      },
      NIGHT: {
        title: "NIGHT",
        colour: "BLACK",
        description: "Play immediately",
        icon: faMoon,
      },
    };

    return cardMap[card.type];
  }

  render() {
    let cardDetails = this.findCardComponent(this.props.card);

    return (
      <button
        class={`salem-card ${cardDetails.colour}`}
        onClick={() => {
          this.handleClick(this.props.card);
        }}
      >
        <div class="salem-card-content">
          <FontAwesomeIcon icon={cardDetails.icon} size="6x" />
          <h6 class="salem-card-title">{cardDetails.title}</h6>
          <span class="salem-card-description">{cardDetails.description}</span>
        </div>
      </button>
    );
  }
}

//Stock ban
//arson burn
//robbery mask
//curse magic
//scapegoat horse
// alibi birthday-cake
//piety cross
//asylum hospital
//matchmaker heart
//blackcat cat
//witness eye
//evidence newspaper
//accusation hand-point-right

import React from "react";
import SalemCard from "./components/SalemCard";
import Swiper from "react-id-swiper";

export default class CharacterView extends React.Component {
  render() {
    let playerState = this.props.playerState;
    let characterName = playerState.character;

    let witchMessage = <div>You are NOT a witch</div>;

    if (playerState.isWitch) {
      witchMessage = <div>You are a WITCH</div>;
    }

    let constableMessage = undefined;

    if (playerState.isConstable) {
      constableMessage = <div>You are the CONSTABLE</div>;
    }
    return (
      <div>
        {characterName}
        {witchMessage}
        {constableMessage}
      </div>
    );
  }
}

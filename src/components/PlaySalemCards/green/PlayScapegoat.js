import PlayCard from "../core/PlayCard";
import React from "react";

export default class PlayScapegoat extends React.Component {
  render() {
    return <PlayCard playerID={this.props.playerID} G={this.props.G} ctx={this.props.ctx}  selectedCardOptions={(...args) => this.props.selectedCardOptions(...args)} />
  }
}
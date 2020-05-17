import PlayCard from "../core/PlayCard";
import React from "react";

export default class PlayEvidence extends React.Component {
  render() {
    return <PlayCard G={this.props.G} ctx={this.props.ctx}  selectedCardOptions={(...args) => this.props.selectedCardOptions(...args)} />
  }
}
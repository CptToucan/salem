import PlayCard from "../core/PlayCard";
import React from "react";

export default class PlayMatchmaker extends React.Component {
  render() {
    return <PlayCard gameMetadata={this.props.gameMetadata} playerID={this.props.playerID} G={this.props.G} ctx={this.props.ctx}  selectedCardOptions={(...args) => this.props.selectedCardOptions(...args)} cancelMove={()=>this.props.cancelMove()} />
  }
}
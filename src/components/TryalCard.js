import React from "react";

export default class TryalCard extends React.Component {
  render() {
    if (this.props.card.isRevealed) {
      return (
        <button onClick={() => this.props.onClick(this.props.card)}>
          {this.props.card.id} {this.props.card.type}
        </button>
      );
    } else {
      return (
        <button onClick={() => this.props.onClick(this.props.card)}>
          Tryal of Witchcraft
        </button>
      );
    }
  }
}

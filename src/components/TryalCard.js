import React from "react";
import Fade from "@material-ui/core/Fade";

export default class TryalCard extends React.Component {
  render() {
    if (this.props.card.isRevealed || this.props.show) {
      return (
        <button
          className="tryal-card tryal-card-revealed"
          onClick={(e) => {console.log("clicked");this.props.onClick(this.props.card, e)}}
        >
          {this.props.card.type}
        </button>
      );
    } else {
      return (
        <button
          className="tryal-card tryal-card-hidden"
          onClick={(e) => {console.log("clicked");this.props.onClick(this.props.card, e)}}
        >
          <div className="tryal-card-content">Tryal of Witchcraft</div>
        </button>
      );
    }
  }
}

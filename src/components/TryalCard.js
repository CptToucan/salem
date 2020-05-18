import React from 'react';


export default class TryalCard extends React.Component {
  render() {
    return (<button onClick={() => this.props.onClick(this.props.card)}>
      {this.props.card.id}
      {this.props.card.type}
    </button>)
  }
}
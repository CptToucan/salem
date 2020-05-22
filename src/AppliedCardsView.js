import React from "react";
import SalemCard from "./components/SalemCard";
import Swiper from "react-id-swiper";

export default class AppliedCardsView extends React.Component {
  render() {
    let redCards = this.props.playerState.appliedRedCards;
    let blueCards = this.props.playerState.appliedBlueCards;
    let greenCards = this.props.playerState.appliedGreenCards;

    let allAppliedCards = [...redCards, ...blueCards, ...greenCards];

    const params = {
      effect: "coverflow",
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 2,
      coverflowEffect: {
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      },
    };

    return (
      <div class="swiper-parent-container">
        <Swiper {...params}>
          {this.renderCards(allAppliedCards)}
        </Swiper>
      </div>
    );
  }

  renderCards(cards) {
    if(cards.length > 0) {
      return cards.map((card) => (
        <div className="salem-card-swiper">
          <SalemCard
            card={card}
            cardClicked={(card, event) => {
              event.stopPropagation();
            }}
          />
        </div>
      ))
    }
    else {
      return <div>
        <span>
        No cards applied
        </span>
      </div>
    }
  }
}
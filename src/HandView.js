import React from "react";
import SalemCard from "./components/SalemCard";
import Swiper from "react-id-swiper";

export default class HandView extends React.Component {
  clickedCard(card) {
    if(this.props.clickedCard) {
      this.props.clickedCard(card);
    }
  }
  render() {
    let hand = this.props.hand;

    const params = {
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 2,
      spaceBetween: 30
    };

    return (
              <div class="swiper-parent-container">
        <Swiper {...params}>
          {hand.map((card) => (
            <div class="salem-card-swiper">
              <SalemCard card={card} cardClicked={(card) => {this.clickedCard(card)}} />
            </div>
          ))}
        </Swiper>
      </div>

    );
  }
}

/**
 *         {hand.map((card) => (
          <SalemCard card={card} />
        ))}
 */

/**
  *         {hand.map((card) => (
          <SalemCard card={card} cardClicked={()=>{}}/>
        ))}
               {hand.map((card) => (
          <SalemCard card={card} cardClicked={()=>{}} />
        ))}
  */

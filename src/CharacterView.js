import React from "react";
import SalemCard from "./components/SalemCard";
import Swiper from "react-id-swiper";

export default class HandView extends React.Component {
  render() {
    let hand = this.props.hand;

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
          {hand.map((card) => (
            <div class="salem-card-swiper">
              <SalemCard card={card} cardClicked={() => {}} />
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

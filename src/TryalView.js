import React from "react";
import SalemCard from "./components/SalemCard";
import Swiper from "react-id-swiper";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TryalCard from "./components/TryalCard";


class TryalView extends React.Component {

  constructor(props){
    super(props);

    let showTryalCard = [];

    showTryalCard.length = this.props.tryalCards.length;
    showTryalCard.fill(false);
    this.state = {
      showTryalCard: showTryalCard
    }
  }

  showTryalCard(index) {
    let showTryalCard = [...this.state.showTryalCard];
    showTryalCard[index] = !showTryalCard[index];
    
    this.setState({...this.state, showTryalCard})
  }

  render() {
    let tryalCards = this.props.tryalCards;

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
      <div className="swiper-parent-container">
        <Swiper {...params}>
          {tryalCards.map((card, index) => (
            <div className="salem-card-swiper">
              <TryalCard card={card} show={this.state.showTryalCard[index]} onClick={(card, event) => {
                event.stopPropagation()
                this.showTryalCard(index);
              }} />
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
export default TryalView;

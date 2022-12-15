import { useState } from "react";
import MyCard from "../MyCard/MyCard";

function MyCards() {

    const [selectedCard, setSelectedCard] = useState(0);

    function onCardClick(selectedCard: number){
        setSelectedCard(selectedCard)
    }

    return (
        <div className="bottom-panel">
        {[.5, 1, 2, 3, 5, 8, 13, 20].map(item=>{
            return <MyCard key={item.toString()} cardNumber={item} selectedCard={selectedCard} onCardClick={onCardClick} />;
        })}
    </div>
    )
  }
  
 export default MyCards
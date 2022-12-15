import MyCard from "../MyCard/MyCard";

function MyCards({selectedCard}:{selectedCard: Number}) {
    return (
        <div className="bottom-panel">
        {[.5, 1, 2, 3, 5, 8, 13, 20 ].map(item=>{
            return <MyCard key={item.toString()} cardNumber={item} selectedCard={selectedCard} />;
        })}
    </div>
    )
  }
  
 export default MyCards
import "babel-polyfill";
import React from 'react';
import MyCardsContainer from './MyCardsContainer';
import TeamCardsContainer from './TeamCardsContainer';

class App extends React.Component {
    render(){
        return(
            <div>
                <TeamCardsContainer />
                <MyCardsContainer />
            </div>
        );
    }
}

export default App;
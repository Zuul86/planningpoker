export default class PokerWebSocket {
    constructor(props) {
        this.socket = new WebSocket('ws://'+ window.location.host +'/PlanningPokerWebSocketHandler.ashx');
        
        this.socket.addEventListener('message', function (event) {
            props.selectCard(JSON.parse(event.data));
        });

        this.socket.addEventListener('open', function (event) {

        });
    }

    sendMessage(message){
        this.socket.send(message);
    }

    close(){
        this.socket.close();
    }
}
export default class PokerWebSocket {
    constructor(props) {
        this.socket = new WebSocket('ws://'+ window.location.host +'/PlanningPokerWebSocketHandler.ashx');
        
        this.socket.addEventListener('message', function (event) {
            const response = JSON.parse(event.data);
            switch(response.Message){
                case 'cardSelection':
                    props.actions.cardActions.selectCard(response.Payload);
                    break;
                case 'clientConnected':
                    props.actions.clientActions.clientConnected(response.Payload);
                    break;
                case 'clientDisconnected':
                    props.actions.clientActions.clientDisconnected(response.Payload);
                    props.actions.cardActions.removeCard(response.Payload);
                    break;
                default:
                    throw new Error('unknown message');
            }
            
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
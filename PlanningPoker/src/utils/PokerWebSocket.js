export default class PokerWebSocket {
    constructor(url, props) {
        this.socket = new WebSocket(url);

        this.socket.addEventListener('message', function (event) {
            props.selectCard(event.data);
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
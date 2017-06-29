namespace PlanningPoker
{
    using System;
    using System.Net.WebSockets;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.WebSockets;

    public class PlanningPokerWebSocketHandler : IHttpHandler
    {
        private readonly IPokerTables _tables;
        private readonly ICardSelections _selections;
        private readonly IMessageExchanger _messageExchanger;

        public PlanningPokerWebSocketHandler() : this(new PokerTables(), new CardSelections(), new MessageExchanger())
        {
            
        }

        public PlanningPokerWebSocketHandler(IPokerTables tables, ICardSelections selections, IMessageExchanger messageExchanger)
        {
            _tables = tables;
            _selections = selections;
            _messageExchanger = messageExchanger;
        }

        public void ProcessRequest(HttpContext context)
        {
            if (context.IsWebSocketRequest)
            {
                context.AcceptWebSocketRequest(ProcessRequestInternal);
            }
        }

        public bool IsReusable { get { return false; } }

        private async Task ProcessRequestInternal(AspNetWebSocketContext context)
        {
            var socket = context.WebSocket;

            var userId = Guid.NewGuid();

            string tableIdInput = context.QueryString.Count > 0 ? context.QueryString[0] : string.Empty;

            var clientConnected = false; 

            var tableId = _tables.AddUserToTable(tableIdInput, userId, socket);

            clientConnected = true;
            var messageProcessor = new MessageProcessor(tableId, _tables);
            while (true)
            {
                if (socket.State == WebSocketState.Open)
                {
                    if (clientConnected)
                    {
                        await _messageExchanger.BroadcastMessageAsync(tableId, "clientConnected", new { NumberOfClients = _tables.Tables[tableId].Count, UserId = userId, TableId = tableId }, _tables);
                        if (_selections.Selections.ContainsKey(tableId))
                        {
                            foreach (var item in _selections.Selections[tableId])
                            {
                                await _messageExchanger.SendMessageAsync(socket, "cardSelection", item);
                            }
                        }
                        clientConnected = false;
                    }
                    var message = await _messageExchanger.ReceiveMessageAsync(socket);

                    await messageProcessor.ProcessMessageAsync(message, userId.ToString(), _selections);
                }
                else
                {
                    var table = _tables.RemoveTable(tableId, userId);
                    await _messageExchanger.BroadcastMessageAsync(tableId, "clientDisconnected", new { NumberOfClients = table.Count, UserId = userId }, _tables);
                    break;
                }
            }
        }
    }
}
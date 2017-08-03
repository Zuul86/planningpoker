namespace PlanningPoker
{
    using Microsoft.ApplicationInsights;
    using PlanningPoker.Messages;
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
        private readonly IMessageProcessor _messageProcessor;
        private TelemetryClient _telemetry = new TelemetryClient();

        public PlanningPokerWebSocketHandler(IMessageExchanger messageExchanger, IMessageProcessor messageProcessor, IPokerTables tables, ICardSelections selections)
        {
            _messageExchanger = messageExchanger;
            _messageProcessor = messageProcessor;
            _tables = tables;
            _selections = selections;
        }

        public void ProcessRequest(HttpContext context)
        {
            if (context.IsWebSocketRequest)
            {
                try
                {
                    context.AcceptWebSocketRequest(ProcessRequestInternal);
                }
                catch(Exception ex)
                {
                    _telemetry.TrackException(ex);
                }
                
            }
        }

        public bool IsReusable { get { return false; } }

        private async Task ProcessRequestInternal(AspNetWebSocketContext context)
        {
            var socket = context.WebSocket;

            var userId = Guid.NewGuid();

            var tableIdInput = GetTableInput(context);

            var tableId = _tables.AddUserToTable(tableIdInput, userId, socket);

            var clientConnected = true;

            while (true)
            {
                if (socket.State == WebSocketState.Open)
                {
                    await ProcessConnectedClientAsync(socket, tableId, userId, clientConnected);

                    var message = await _messageExchanger.ReceiveMessageAsync(socket);

                    await _messageProcessor.ProcessMessageAsync(message, userId, tableId);
                }
                else if (socket.State == WebSocketState.Connecting)
                {

                }
                else
                {
                    await ProcessDisconnectedClientAsync(tableId, userId);
                    break;
                }
            }
        }

        private string GetTableInput(AspNetWebSocketContext context)
        {
            return context.QueryString.Count > 0 ? context.QueryString[0] : string.Empty;
        }

        private async Task ProcessConnectedClientAsync(WebSocket socket, string tableId, Guid userId, bool clientConnected)
        {
            if (clientConnected)
            {
                await _messageExchanger.BroadcastMessageAsync(tableId, "clientConnected", new { NumberOfClients = _tables.Tables[tableId].Count, UserId = userId, TableId = tableId });
                if (_selections.Selections.ContainsKey(tableId))
                {
                    foreach (var item in _selections.Selections[tableId])
                    {
                        await _messageExchanger.SendMessageAsync(socket, "cardSelection", item);
                    }
                }
                clientConnected = false;
            }
        }

        private async Task ProcessDisconnectedClientAsync(string tableId, Guid userId)
        {
            var table = _tables.RemoveTable(tableId, userId);
            await _messageExchanger.BroadcastMessageAsync(tableId, "clientDisconnected", new { NumberOfClients = table.Count, UserId = userId });
        }
    }
}
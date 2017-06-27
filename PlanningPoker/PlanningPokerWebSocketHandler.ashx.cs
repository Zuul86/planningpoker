using System;
using System.Collections.Generic;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.WebSockets;

namespace PlanningPoker
{
    /// <summary>
    /// Summary description for PlanningPokerWebSocketHandler
    /// </summary>
    public class PlanningPokerWebSocketHandler : IHttpHandler
    {
        private readonly IPokerTables _tables;
        private readonly ICardSelections _selections;

        public PlanningPokerWebSocketHandler() : this(new PokerTables(), new CardSelections())
        {
            
        }

        public PlanningPokerWebSocketHandler(IPokerTables tables, ICardSelections selections)
        {
            _tables = tables;
            _selections = selections;
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

            while (true)
            {
                if (socket.State == WebSocketState.Open)
                {
                    if (clientConnected)
                    {
                        await BroadcastMessageAsync(tableId, "clientConnected", new { NumberOfClients = _tables.Tables[tableId].Count, UserId = userId, TableId = tableId });
                        if (_selections.Selections.ContainsKey(tableId))
                        {
                            foreach (var item in _selections.Selections[tableId])
                            {
                                await SendMessageAsync(socket, tableId, "cardSelection", item);
                            }
                        }
                        clientConnected = false;
                    }
                    var message = await ReceiveMessageAsync(socket);

                    if (!string.IsNullOrEmpty(message))
                    {
                        await ProcessMessage(tableId, message, userId.ToString());
                    }
                }
                else
                {
                    var table = _tables.RemoveTable(tableId, userId);
                    await BroadcastMessageAsync(tableId, "clientDisconnected", new { NumberOfClients = table.Count, UserId = userId });
                    break;
                }
            }
        }

        private async Task ProcessMessage(string tableId, string message, string id)
        {
            var serializer = new JavaScriptSerializer();
            var messageObj = serializer.Deserialize<SocketMessage>(message);
            switch (messageObj.Type)
            {
                case "effort":
                    var cardSelection = new CardSelection { Effort = messageObj.Value, UserId = id };
                    await BroadcastMessageAsync(tableId, "cardSelection", cardSelection);
                    _selections.StoreCardSelection(tableId, cardSelection);
                    break;
                case "reveal":
                    bool doReveal;
                    bool.TryParse(messageObj.Value, out doReveal);
                    await BroadcastMessageAsync(tableId, "revealCards", new { ShowCards = doReveal });
                    break;
                case "reset":
                    await BroadcastMessageAsync(tableId, "reset", new { ResetTable = messageObj.Value });
                    _selections.ClearCardSelections(tableId);
                    break;
            }
        }
        
        private async Task BroadcastMessageAsync(string tableId, string message, object payload)
        {
            foreach (var client in _tables.Tables[tableId])
            {
                await SendMessageAsync(client.Value, tableId, message, payload);
            }
        }

        private async Task SendMessageAsync(WebSocket socket, string tableId, string messsage, object payload)
        {
            var serializer = new JavaScriptSerializer();

            var message = serializer.Serialize(new { Message = messsage, Payload = payload });
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        private async Task<string> ReceiveMessageAsync(WebSocket socket)
        {
            var buffer = new ArraySegment<byte>(new byte[1024]);

            WebSocketReceiveResult result = null;
            using (var stream = new MemoryStream())
            {
                do
                {
                    result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                    await stream.WriteAsync(buffer.Array, buffer.Offset, result.Count);
                } while (!result.EndOfMessage);

                stream.Seek(0, SeekOrigin.Begin);

                using (var reader = new StreamReader(stream, Encoding.UTF8))
                {
                    return await reader.ReadToEndAsync();
                }
            }
        }
    }
}
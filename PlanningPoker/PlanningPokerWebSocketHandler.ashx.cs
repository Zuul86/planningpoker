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
        private static readonly IDictionary<string, IDictionary<Guid, WebSocket>> Tables = new Dictionary<string, IDictionary<Guid, WebSocket>>();

        private static readonly ReaderWriterLockSlim Locker = new ReaderWriterLockSlim();

        public void ProcessRequest(HttpContext context)
        {
            if (context.IsWebSocketRequest)
            {
                context.AcceptWebSocketRequest(ProcessRequestInternal);
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }

        private async Task ProcessRequestInternal(AspNetWebSocketContext context)
        {
            var socket = context.WebSocket;
            var uniqueId = Guid.NewGuid();
            string tableId = context.QueryString.Count > 0 ? context.QueryString[0] : string.Empty;
            var clientConnected = false;

            Locker.EnterWriteLock();
            try
            {
                if(string.IsNullOrEmpty(tableId))
                {
                    tableId = GenerateShortUniqueId();
                }

                if (Tables.ContainsKey(tableId))
                {
                    Tables[tableId].Add(uniqueId, socket);
                    
                }
                else
                {
                    Tables.Add(tableId, new Dictionary<Guid, WebSocket> { { uniqueId, socket } });
                }

                clientConnected = true;
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            while (true)
            {
                if (socket.State == WebSocketState.Open)
                {
                    if (clientConnected)
                    {
                        await SendMessageAsync(tableId, "clientConnected", new { NumberOfClients = Tables[tableId].Count, UserId = uniqueId, TableId = tableId });

                        clientConnected = false;
                    }
                    var message = await ReceiveMessageAsync(socket);

                    if (!string.IsNullOrEmpty(message))
                    {
                        await ProcessMessage(tableId, message, uniqueId.ToString());
                    }
                }
                else
                {
                    Locker.EnterWriteLock();
                    try
                    {
                        if (string.IsNullOrEmpty(tableId))
                        {
                            tableId = GenerateShortUniqueId();
                        }

                        var table = Tables[tableId];

                        table.Remove(uniqueId);
                        await SendMessageAsync(tableId, "clientDisconnected", new { NumberOfClients = table.Count, UserId = uniqueId });
                    }
                    finally
                    {
                        Locker.ExitWriteLock();
                    }

                    break;

                }
            }
        }

        private string GenerateShortUniqueId()
        {
            var base62chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".ToCharArray();

            var _random = new Random();

            var sb = new StringBuilder(6);

            for (int i = 0; i < 6; i++)
                sb.Append(base62chars[_random.Next(36)]);

            return sb.ToString();
        }

        private async Task ProcessMessage(string tableId, string message, string id)
        {
            //check for empty message
            var serializer = new JavaScriptSerializer();
            var messageObj = serializer.Deserialize<SocketMessage>(message);
            switch (messageObj.Type)
            {
                case "effort":
                    await SendMessageAsync(tableId, "cardSelection", new { Effort = messageObj.Value, UserId = id });
                    break;
                case "reveal":
                    bool doReveal;
                    bool.TryParse(messageObj.Value, out doReveal);
                    await SendMessageAsync(tableId, "revealCards", new { ShowCards = doReveal });
                    break;
                case "reset":
                    await SendMessageAsync(tableId, "reset", new { ResetTable = messageObj.Value });
                    break;
            }
        }

        private async Task SendMessageAsync(string tableId, string messsage, object payload)
        {
            var serializer = new JavaScriptSerializer();

            var message = serializer.Serialize(new { Message = messsage, Payload = payload });
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
            foreach (var client in Tables[tableId])
            {
                await client.Value.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            }
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
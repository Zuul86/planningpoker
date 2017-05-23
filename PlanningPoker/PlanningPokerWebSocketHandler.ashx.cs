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
        private static readonly IDictionary<Guid, WebSocket> Clients = new Dictionary<Guid, WebSocket>();

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
            var clientConnected = false;

            Locker.EnterWriteLock();
            try
            {
                Clients.Add(uniqueId, socket);
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
                        await SendMessageAsync("clientConnection", new { NumberOfClients = Clients.Count });

                        clientConnected = false;
                    }

                    var effort = await ReceiveMessageAsync(socket);
                    //hack for now, not sure why receiving empty packet on refresh or browser close
                    if (!string.IsNullOrEmpty(effort))
                    {
                        await SendMessageAsync("cardSelection", new { Effort = effort, UserId = uniqueId.ToString() });
                    }
                }
                else
                {
                    Locker.EnterWriteLock();
                    try
                    {
                        Clients.Remove(uniqueId);
                        await SendMessageAsync("clientConnection", new { NumberOfClients = Clients.Count });
                    }
                    finally
                    {
                        Locker.ExitWriteLock();
                    }

                    break;

                }
            }
        }

        private async Task SendMessageAsync(string messsage, object payload)
        {
            var serializer = new JavaScriptSerializer();

            var message = serializer.Serialize(new { Message = messsage, Payload = payload });
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
            foreach (var client in Clients)
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
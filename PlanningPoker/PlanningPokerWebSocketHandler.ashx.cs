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

            Locker.EnterWriteLock();
            try
            {
                Clients.Add(uniqueId, socket);
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            while (true)
            {
                var buffer = new ArraySegment<byte>(new byte[1024]);

                WebSocketReceiveResult result = null;
                string effort;
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
                        effort = await reader.ReadToEndAsync();
                    }
                }
                
                if (socket.State == WebSocketState.Open)
                {
                    var serializer = new JavaScriptSerializer();
                    var message = serializer.Serialize(new { effort = effort, userId = uniqueId.ToString() });
                    buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
                    foreach (var client in Clients)
                    {
                        await client.Value.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
                else
                {
                    Locker.EnterWriteLock();
                    try
                    {
                        Clients.Remove(uniqueId);
                    }
                    finally
                    {
                        Locker.ExitWriteLock();
                    }

                    break;

                }
            }
        }
    }
}
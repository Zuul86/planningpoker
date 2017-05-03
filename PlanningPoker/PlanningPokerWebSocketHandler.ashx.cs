using System;
using System.Collections.Generic;
using System.IO;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.WebSockets;

namespace PlanningPoker
{
    /// <summary>
    /// Summary description for PlanningPokerWebSocketHandler
    /// </summary>
    public class PlanningPokerWebSocketHandler : IHttpHandler
    {
        private static readonly IList<WebSocket> Clients = new List<WebSocket>();

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

            Locker.EnterWriteLock();
            try
            {
                Clients.Add(socket);
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            while (true)
            {
                var buffer = new ArraySegment<byte>(new byte[1024]);

                WebSocketReceiveResult result = null;
                string message;
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
                        message = await reader.ReadToEndAsync();
                    }
                }
                
                if (socket.State == WebSocketState.Open)
                {
                    buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
                    foreach (var client in Clients)
                    {
                        await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
                else
                {
                    Locker.EnterWriteLock();
                    try
                    {
                        Clients.Remove(socket);
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
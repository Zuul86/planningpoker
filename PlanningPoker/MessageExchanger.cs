namespace PlanningPoker
{
    using System;
    using System.IO;
    using System.Net.WebSockets;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;
    using System.Web.Script.Serialization;

    public class MessageExchanger : IMessageExchanger
    {
        private readonly IPokerTables _tables;

        public MessageExchanger(IPokerTables tables)
        {
            _tables = tables;
        }

        public async Task SendMessageAsync(WebSocket socket, string messsage, object payload)
        {
            var serializer = new JavaScriptSerializer();

            var message = serializer.Serialize(new { Message = messsage, Payload = payload });
            var buffer = new ArraySegment<byte>(Encoding.UTF8.GetBytes(message));
            await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        }

        public async Task<string> ReceiveMessageAsync(WebSocket socket)
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

        public async Task BroadcastMessageAsync(string tableId, string message, object payload)
        {
            if (_tables.Tables.ContainsKey(tableId))
            {
                foreach (var client in _tables.Tables[tableId])
                {
                    await SendMessageAsync(client.Value.Socket, message, payload);
                }
            }
        }
    }
}
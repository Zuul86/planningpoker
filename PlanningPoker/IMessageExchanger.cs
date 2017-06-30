namespace PlanningPoker
{
    using System.Net.WebSockets;
    using System.Threading.Tasks;

    public interface IMessageExchanger
    {
        Task SendMessageAsync(WebSocket socket, string messsage, object payload);
        Task<string> ReceiveMessageAsync(WebSocket socket);
        Task BroadcastMessageAsync(string tableId, string message, object payload);
    }
}

using System.Net.WebSockets;

namespace PlanningPoker
{
    public class User
    {
        public WebSocket Socket { get; set; }

        public string Name { get; set; }
    }
}
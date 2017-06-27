namespace PlanningPoker
{
    using System;
    using System.Collections.Generic;
    using System.Net.WebSockets;
    public interface IPokerTables
    {
        IDictionary<string, IDictionary<Guid, WebSocket>> Tables { get; }
        string AddUserToTable(string tableId, Guid userId, WebSocket socket);
        IDictionary<Guid, WebSocket> RemoveTable(string tableId, Guid userId);
    }
}
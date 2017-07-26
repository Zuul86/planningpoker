namespace PlanningPoker
{
    using System;
    using System.Collections.Generic;
    using System.Net.WebSockets;
    public interface IPokerTables
    {
        IDictionary<string, IDictionary<Guid, User>> Tables { get; }
        string AddUserToTable(string tableId, Guid userId, WebSocket socket);
        IDictionary<Guid, User> RemoveTable(string tableId, Guid userId);
    }
}
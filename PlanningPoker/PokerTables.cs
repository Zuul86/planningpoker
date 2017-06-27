namespace PlanningPoker
{
    using System;
    using System.Collections.Generic;
    using System.Net.WebSockets;
    using System.Threading;

    public class PokerTables : IPokerTables
    {
        private static readonly IDictionary<string, IDictionary<Guid, WebSocket>> _tables = new Dictionary<string, IDictionary<Guid, WebSocket>>();
        private static readonly ReaderWriterLockSlim Locker = new ReaderWriterLockSlim();
        private readonly IUniqueIdGenerator _generator;

        public PokerTables() : this(new UniqueIdGenerator())
        {

        }

        public PokerTables(IUniqueIdGenerator generator)
        {
            _generator = generator;
        }

        public IDictionary<string, IDictionary<Guid, WebSocket>> Tables
        {
            get
            {
                return _tables;
            }
        }

        public string AddUserToTable(string tableId, Guid userId, WebSocket socket)
        {
            Locker.EnterWriteLock();
            try
            {
                if (string.IsNullOrEmpty(tableId))
                {
                    tableId = _generator.GenerateShortUniqueId();
                }

                if (Tables.ContainsKey(tableId))
                {
                    Tables[tableId].Add(userId, socket);
                }
                else
                {
                    Tables.Add(tableId, new Dictionary<Guid, WebSocket> { { userId, socket } });
                }
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            return tableId;
        }

        public IDictionary<Guid, WebSocket> RemoveTable(string tableId, Guid userId)
        {
            Locker.EnterWriteLock();
            IDictionary<Guid, WebSocket> table;
            try
            {
                table = Tables[tableId];
                table.Remove(userId);
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            return table;
        }
    }
}
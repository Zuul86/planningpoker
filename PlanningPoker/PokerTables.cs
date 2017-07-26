namespace PlanningPoker
{
    using System;
    using System.Collections.Generic;
    using System.Net.WebSockets;
    using System.Threading;

    public class PokerTables : IPokerTables
    {
        private static readonly IDictionary<string, IDictionary<Guid, User>> _tables = new Dictionary<string, IDictionary<Guid, User>>();
        private static readonly ReaderWriterLockSlim Locker = new ReaderWriterLockSlim();
        private readonly IUniqueIdGenerator _generator;

        public PokerTables() : this(new UniqueIdGenerator())
        {

        }

        public PokerTables(IUniqueIdGenerator generator)
        {
            _generator = generator;
        }

        public IDictionary<string, IDictionary<Guid, User>> Tables
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

                var user = new User { Name = string.Empty, Socket = socket };

                if (Tables.ContainsKey(tableId))
                {
                    Tables[tableId].Add(userId, user);
                }
                else
                {
                    Tables.Add(tableId, new Dictionary<Guid, User> { { userId, user } });
                }
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            return tableId;
        }

        public IDictionary<Guid, User> RemoveTable(string tableId, Guid userId)
        {
            Locker.EnterWriteLock();
            IDictionary<Guid, User> table;
            try
            {
                table = Tables[tableId];
                table.Remove(userId);

                if(table.Count == 0)
                {
                    Tables.Remove(tableId);
                }
            }
            finally
            {
                Locker.ExitWriteLock();
            }

            return table;
        }
    }
}
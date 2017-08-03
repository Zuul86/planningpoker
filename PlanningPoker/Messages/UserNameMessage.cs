namespace PlanningPoker.Messages
{
    using System;
    using System.Threading.Tasks;

    public class UserNameMessage : IMessage
    {
        private readonly IMessageExchanger _messageExchanger;
        private readonly IPokerTables _tables;
        
        public UserNameMessage(IMessageExchanger messageExchanger, IPokerTables tables)
        {
            _tables = tables;
            _messageExchanger = messageExchanger;
        }

        public string MessageType => "userName";

        public async Task Execute(string tableId, dynamic message)
        {
            var userId = new Guid(message.UserId);
            _tables.Tables[tableId][userId].Name = message.Value;
            await _messageExchanger.BroadcastMessageAsync(tableId, "userName", new { UserId = message.UserId, Name = message.Value });
        }
    }
}
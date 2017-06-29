namespace PlanningPoker
{
    using PlanningPoker.Messages;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Script.Serialization;

    public class MessageProcessor : IMessageProcessor
    {
        private readonly IList<IMessage> _messages;
        private readonly string _tableId;
        private readonly IPokerTables _tables;

        public MessageProcessor(string tableId, IPokerTables tables)
        {
            var exchanger = new MessageExchanger();
            _messages = new List<IMessage>
            {
                new EffortMessage(exchanger),
                new RevealMessage(exchanger),
                new ResetMessage(exchanger)
            };
            _tableId = tableId;
            _tables = tables;
        }

        public async Task ProcessMessageAsync(string messagePayload, string userId, ICardSelections selections)
        {
            if (string.IsNullOrEmpty(messagePayload)) return;

            var serializer = new JavaScriptSerializer();
            var messageObj = serializer.Deserialize<SocketMessage>(messagePayload);

            foreach (var message in _messages)
            {
                if (messageObj.Type == message.MessageType)
                {
                    await message.Execute(_tableId, new { Value = messageObj.Value, UserId = userId }, _tables, selections);
                }
            }
        }
    }
}
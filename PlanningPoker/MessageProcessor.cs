namespace PlanningPoker
{
    using PlanningPoker.Messages;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Script.Serialization;

    public class MessageProcessor : IMessageProcessor
    {
        private readonly IList<IMessage> _messages;
        private readonly IPokerTables _tables;
        private readonly ICardSelections _selections;

        public MessageProcessor(IPokerTables tables, ICardSelections selections)
        {
            var exchanger = new MessageExchanger();
            _messages = new List<IMessage>
            {
                new EffortMessage(exchanger),
                new RevealMessage(exchanger),
                new ResetMessage(exchanger)
            };
            _tables = tables;
            _selections = selections;
        }

        public async Task ProcessMessageAsync(string messagePayload, string userId, string tableId)
        {
            if (string.IsNullOrEmpty(messagePayload)) return;

            var serializer = new JavaScriptSerializer();
            var messageObj = serializer.Deserialize<SocketMessage>(messagePayload);

            foreach (var message in _messages)
            {
                if (messageObj.Type == message.MessageType)
                {
                    await message.Execute(tableId, new { Value = messageObj.Value, UserId = userId }, _tables, _selections);
                }
            }
        }
    }
}
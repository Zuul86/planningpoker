namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public class EffortMessage : IMessage
    {
        private readonly IMessageExchanger _messageExchanger;
        private readonly ICardSelections _selections;

        public EffortMessage(IMessageExchanger messageExchanger, ICardSelections selections)
        {
            _messageExchanger = messageExchanger;
            _selections = selections;
        }

        public string MessageType => "effort";

        public async Task Execute(string tableId, dynamic message)
        {
            await _messageExchanger.BroadcastMessageAsync(tableId, "cardSelection", new { Effort = message.Value, UserId = message.UserId });
            _selections.StoreCardSelection(tableId, new CardSelection { Effort = message.Value, UserId = message.UserId, });
        }
    }

    
}
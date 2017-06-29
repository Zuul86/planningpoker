namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public class EffortMessage : IMessage
    {
        private readonly IMessageExchanger _messageExchanger;

        public EffortMessage(IMessageExchanger messageExchanger)
        {
            _messageExchanger = messageExchanger;
        }

        public string MessageType => "effort";

        public async Task Execute(string tableId, dynamic message, IPokerTables tables, ICardSelections selections)
        {
            await _messageExchanger.BroadcastMessageAsync(tableId, "cardSelection", new { Effort = message.Value, UserId = message.UserId }, tables);
            selections.StoreCardSelection(tableId, new CardSelection { Effort = message.Value, UserId = message.UserId, });
        }
    }

    
}
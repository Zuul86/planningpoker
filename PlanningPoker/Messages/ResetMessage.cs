namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public class ResetMessage : IMessage
    {
        private readonly IMessageExchanger _messageExchanger;

        public ResetMessage(IMessageExchanger messageExchanger)
        {
            _messageExchanger = messageExchanger;
        }

        public string MessageType => "reset";

        public async Task Execute(string tableId, dynamic message, IPokerTables tables, ICardSelections selections)
        {
            await _messageExchanger.BroadcastMessageAsync(tableId, "reset", new { ResetTable = message.Value }, tables);
            selections.ClearCardSelections(tableId);
        }
    }
}
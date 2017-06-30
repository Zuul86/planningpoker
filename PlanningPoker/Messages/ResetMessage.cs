namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public class ResetMessage : IMessage
    {
        private readonly IMessageExchanger _messageExchanger;
        private readonly ICardSelections _selections;

        public ResetMessage(IMessageExchanger messageExchanger, ICardSelections selections)
        {
            _messageExchanger = messageExchanger;
            _selections = selections;
        }

        public string MessageType => "reset";

        public async Task Execute(string tableId, dynamic message)
        {
            await _messageExchanger.BroadcastMessageAsync(tableId, "reset", new { ResetTable = message.Value });
            _selections.ClearCardSelections(tableId);
        }
    }
}
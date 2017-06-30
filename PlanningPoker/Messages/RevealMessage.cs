namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public class RevealMessage : IMessage
    {
        private readonly IMessageExchanger _messageExchanger;

        public RevealMessage(IMessageExchanger messageExchanger)
        {
            _messageExchanger = messageExchanger;
        }

        public string MessageType => "reveal";

        public async Task Execute(string tableId, dynamic message)
        {
            await _messageExchanger.BroadcastMessageAsync(tableId, "revealCards", new { ShowCards = message.Value });
        }
    }
}
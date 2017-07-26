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
            if (!bool.TryParse(message.Value, out bool showCards))
            {
                showCards = false;
            }
            await _messageExchanger.BroadcastMessageAsync(tableId, "revealCards", new { ShowCards = showCards });
        }
    }
}
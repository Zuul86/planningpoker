namespace PlanningPoker
{
    using PlanningPoker.Messages;
    using System;
    using System.Threading.Tasks;
    using System.Web.Script.Serialization;

    public class MessageProcessor : IMessageProcessor
    {
        private readonly IMessageContainer _messageContainer;

        public MessageProcessor(IMessageContainer messageContainer)
        {
            _messageContainer = messageContainer;
        }

        public async Task ProcessMessageAsync(string messagePayload, Guid userId, string tableId)
        {
            if (string.IsNullOrEmpty(messagePayload)) return;

            var serializer = new JavaScriptSerializer();
            var messageObj = serializer.Deserialize<SocketMessage>(messagePayload);

            foreach (var message in _messageContainer.Messages)
            {
                if (messageObj.Type == message.MessageType)
                {
                    await message.Execute(tableId, new { Value = messageObj.Value, UserId = userId.ToString() });
                }
            }
        }
    }
}
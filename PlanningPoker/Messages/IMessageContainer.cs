namespace PlanningPoker.Messages
{
    using System.Collections.Generic;
    public interface IMessageContainer
    {
        IEnumerable<IMessage> Messages { get; }
    }
}
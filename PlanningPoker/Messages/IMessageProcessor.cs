namespace PlanningPoker.Messages
{
    using System;
    using System.Threading.Tasks;

    public interface IMessageProcessor
    {
        Task ProcessMessageAsync(string messagePayload, Guid userId, string tableId);
    }
}
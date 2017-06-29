namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public interface IMessageProcessor
    {
        Task ProcessMessageAsync(string type, string userId, ICardSelections selections);
    }
}
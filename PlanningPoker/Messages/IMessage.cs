namespace PlanningPoker.Messages
{
    using System.Threading.Tasks;

    public interface IMessage
    {
        string MessageType { get; }

        Task Execute(string tableId, dynamic message);
    }
}
namespace PlanningPoker.App_Start
{
    using Microsoft.Practices.Unity;
    using PlanningPoker.Messages;

    public static class UnityConfig
    {
        public static void RegisterTypes(IUnityContainer container)
        {
            container.RegisterType<IMessageExchanger, MessageExchanger>();
            container.RegisterType<IPokerTables, PokerTables>();
            container.RegisterType<ICardSelections, CardSelections>();
            container.RegisterType<IUniqueIdGenerator, UniqueIdGenerator>();
            container.RegisterType<IMessageProcessor, MessageProcessor>();
            container.RegisterType<IMessageContainer, MessageContainer>();
        }
    }
}
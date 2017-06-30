namespace PlanningPoker.Messages
{
    using System.Collections.Generic;
    using Microsoft.Practices.Unity;

    public class MessageContainer : IMessageContainer
    {
        public IEnumerable<IMessage> Messages
        {
            get
            {
                yield return MvcApplication.Container.Resolve<EffortMessage>();
                yield return MvcApplication.Container.Resolve<RevealMessage>();
                yield return MvcApplication.Container.Resolve<ResetMessage>();
            }
        }
    }
}
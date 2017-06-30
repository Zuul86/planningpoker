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
                yield return MvcApplication.Unity.Resolve<EffortMessage>();
                yield return MvcApplication.Unity.Resolve<RevealMessage>();
                yield return MvcApplication.Unity.Resolve<ResetMessage>();
            }
        }
    }
}
namespace PlanningPoker.Messages
{
    using System.Collections.Generic;
    using Microsoft.Practices.Unity;

    public class MessageContainer : IMessageContainer
    {
        private readonly IDendencyResolver _resolver;

        public MessageContainer(IDendencyResolver resolver)
        {
            _resolver = resolver;
        }

        public IEnumerable<IMessage> Messages
        {
            get
            {
                yield return _resolver.Resolve<EffortMessage>();
                yield return _resolver.Resolve<RevealMessage>();
                yield return _resolver.Resolve<ResetMessage>();
            }
        }
    }
}
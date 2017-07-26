namespace PlanningPoker.Messages
{
    using System.Collections.Generic;

    public class MessageContainer : IMessageContainer
    {
        private readonly IDependencyResolver _resolver;

        public MessageContainer(IDependencyResolver resolver)
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
                yield return _resolver.Resolve<UserNameMessage>();
            }
        }
    }
}
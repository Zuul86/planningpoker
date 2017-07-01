using System.Web;
using Microsoft.Practices.Unity;

namespace PlanningPoker
{

    public class HttpHandlerFactory : IHttpHandlerFactory
    {
        private IDependencyResolver _resolver;

        public HttpHandlerFactory() : this(new DependencyResolver())
        {

        }

        public HttpHandlerFactory(IDependencyResolver resolver)
        {
            _resolver = resolver;
        }

        public IHttpHandler GetHandler(HttpContext context, string requestType, string url, string pathTranslated)
        {
            if (url == "/PlanningPokerWebSocketHandler.ashx")
            {
                return _resolver.Resolve<PlanningPokerWebSocketHandler>();
            }
            return null;
        }

        public void ReleaseHandler(IHttpHandler handler)
        {
            
        }
    }
}
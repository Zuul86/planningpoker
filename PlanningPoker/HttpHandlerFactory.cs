using System.Web;
using Microsoft.Practices.Unity;

namespace PlanningPoker
{
    public class HttpHandlerFactory : IHttpHandlerFactory
    {
        public IHttpHandler GetHandler(HttpContext context, string requestType, string url, string pathTranslated)
        {
            if (url == "/PlanningPokerWebSocketHandler.ashx")
            {
                return MvcApplication.Unity.Resolve<PlanningPokerWebSocketHandler>();
            }
            return null;
        }

        public void ReleaseHandler(IHttpHandler handler)
        {
            
        }
    }
}
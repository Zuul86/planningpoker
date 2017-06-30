namespace PlanningPoker
{
    using Microsoft.Practices.Unity;
    using PlanningPoker.Messages;
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;

    public class MvcApplication : System.Web.HttpApplication
    {
        internal static readonly IUnityContainer Unity = new UnityContainer();

        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            Unity.RegisterType<IMessageExchanger, MessageExchanger>();
            Unity.RegisterType<IPokerTables, PokerTables>();
            Unity.RegisterType<ICardSelections, CardSelections>();
            Unity.RegisterType<IUniqueIdGenerator, UniqueIdGenerator>();
            Unity.RegisterType<IMessageProcessor, MessageProcessor>();
            Unity.RegisterType<IMessageContainer, MessageContainer>();
        }
    }
}

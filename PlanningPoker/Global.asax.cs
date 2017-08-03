namespace PlanningPoker
{
    using Microsoft.Practices.Unity;
    using PlanningPoker.App_Start;
    using System.Web.Mvc;
    using System.Web.Routing;

    public class MvcApplication : System.Web.HttpApplication
    {
        internal static readonly IUnityContainer Container = new UnityContainer();

        protected void Application_Start()
        {
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            UnityConfig.RegisterTypes(Container);
        }
    }
}

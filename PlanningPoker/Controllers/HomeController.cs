using System.Web.Mvc;

namespace PlanningPoker.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}
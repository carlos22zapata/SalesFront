using Microsoft.AspNetCore.Mvc;

namespace SalesFront.Controllers
{
    public class HomeController : Controller
    {
        public HomeController()
        {

        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult LoginFailed()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
    }
}

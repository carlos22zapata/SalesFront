using Microsoft.AspNetCore.Mvc;

namespace SalesFront.Controllers
{
    public class PrincipalController : Controller
    {
        public PrincipalController()
        {
            
        }

        public IActionResult Index(string token)
        {
            //Aquí, conectarme a la api del backend a algun método que me devuelva true si valida el token, si lo valida entonces muestro la página,
            //si no redirijo a otro lado.
            
            return View();
        }

        
    }
}

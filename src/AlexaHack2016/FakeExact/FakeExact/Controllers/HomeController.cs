using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FakeExact.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			ViewBag.Message = "hannif goozoo.";
			return View();
		}

		public ActionResult About()
		{
			ViewBag.Message = "bahman goozoo.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "masoud gassy.";

			return View();
		}
	}
}
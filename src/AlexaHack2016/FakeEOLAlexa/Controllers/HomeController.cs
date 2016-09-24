using FakeEOLAlexa.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FakeEOLAlexa.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index(string a)
		{
			string x = readNewAction();
			NewModel m = new NewModel();
			m.image = x;
			return View(m);
		}

		public ActionResult test()
		{
			string x = readNewAction();
			NewModel m = new NewModel();
			m.image = x;
			return PartialView("someimg", m);
		}

		public void Set(string a)
		{
			writeNewAction(a);
		}

		public ActionResult About()
		{
			ViewBag.Message = "Your application description page.";

			return View();
		}

		public ActionResult Contact()
		{
			ViewBag.Message = "Your contact page.";

			return View();
		}

		private void writeNewAction(string newaction)
		{
			string path = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "x.abc");
			System.IO.File.WriteAllText(path, newaction);
		}

		private string readNewAction()
		{
			try
			{
				string path = System.IO.Path.Combine(HttpRuntime.AppDomainAppPath, "x.abc");
				return System.IO.File.ReadAllText(path);
			}
			catch (Exception)
			{
				return "1";
			}
		}
	}
}
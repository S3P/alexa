using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class AlexaRequest
	{
		public string version { get; set; }
		public Session session { get; set; }
		public Context context { get; set; }
		public Request request { get; set; }
	}

}
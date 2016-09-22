using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class AlexaMathRequest
	{
		public Session session { get; set; }
		public MathRequest request { get; set; }
		public string version { get; set; }
	}

	public class MathRequest
	{
		public string type { get; set; }
		public string requestId { get; set; }
		public string locale { get; set; }
		public DateTime timestamp { get; set; }
		public MathIntent intent { get; set; }
	}

	public class MathIntent
	{
		public string name { get; set; }
		public MathSlots slots { get; set; }
	}

	public class MathSlots
	{
		public Numberb NumberB { get; set; }
		public Numbera NumberA { get; set; }
	}

	public class Numberb
	{
		public string name { get; set; }
		public string value { get; set; }
	}

	public class Numbera
	{
		public string name { get; set; }
		public string value { get; set; }
	}
}
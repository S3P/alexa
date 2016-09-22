using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class POCOs
	{
	}

	public class Rootobject
	{
		public Session session { get; set; }
		public Request request { get; set; }
		public string version { get; set; }
	}

	public class Session
	{
		public string sessionId { get; set; }
		public Application application { get; set; }
		public Attributes attributes { get; set; }
		public User user { get; set; }
		public bool _new { get; set; }
	}

	public class Application
	{
		public string applicationId { get; set; }
	}

	public class Attributes
	{
	}

	public class User
	{
		public string userId { get; set; }
	}

	public class Request
	{
		public string type { get; set; }
		public string requestId { get; set; }
		public string locale { get; set; }
		public DateTime timestamp { get; set; }
		public Intent intent { get; set; }
	}

	public class Intent
	{
		public string name { get; set; }
		public Slots slots { get; set; }
	}

	public class Slots
	{
		object data;
	}

}


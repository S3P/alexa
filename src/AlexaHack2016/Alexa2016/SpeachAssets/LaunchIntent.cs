using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class LaunchIntent
	{ 
		public string version { get; set; }
		public Session session { get; set; }
		public Context context { get; set; }
		public LaunchRequest request { get; set; }
	}
	
	public class Context
	{
		public Audioplayer AudioPlayer { get; set; }
		public System System { get; set; }
	}

	public class Audioplayer
	{
		public string playerActivity { get; set; }
	}

	public class System
	{
		public Application application { get; set; }
		public User user { get; set; }
		public Device device { get; set; }
	}
	
	public class Device
	{
		public Supportedinterfaces supportedInterfaces { get; set; }
	}

	public class Supportedinterfaces
	{
		public Audioplayer AudioPlayer { get; set; }
	}
	
	public class LaunchRequest
	{
		public string type { get; set; }
		public string requestId { get; set; }
		public DateTime timestamp { get; set; }
		public string locale { get; set; }
	}

}
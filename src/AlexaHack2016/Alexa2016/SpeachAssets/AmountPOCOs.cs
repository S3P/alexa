using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class AmountPOCOs
	{
		public D d { get; set; }
	}

	public class D
	{
		public Result[] results { get; set; }
	}

	public class Result
	{
		public __Metadata __metadata { get; set; }
		public int TotalAmount { get; set; }
		public int AgeGroup2Amount { get; set; }
	}

	public class __Metadata
	{
		public string uri { get; set; }
		public string type { get; set; }
	}

}
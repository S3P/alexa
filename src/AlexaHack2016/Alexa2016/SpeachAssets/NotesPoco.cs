using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class NotesPoco
	{
		public NoteD d { get; set; }
	}

	public class NoteD
	{
		public NoteResult[] results { get; set; }
	}

	public class NoteResult
	{
		public __Metadata __metadata { get; set; }
		public string Remarks { get; set; }
	}
}
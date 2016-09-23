using Microsoft.VisualStudio.TestTools.UnitTesting;
using Alexa2016.SpeachAssets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Alexa2016.SpeachAssets.Tests
{
	[TestClass()]
	public class SSMLBuilderTests
	{
		[TestMethod()]
		public void ToStringTest()
		{
			SSMLBuilder builder = new SSMLBuilder("Hello");
			string text = builder.AddSpeak().AddParagraph().ToString();

			Assert.AreEqual("<speak><p>Hello</p></speak>",text);
		}
	}
}
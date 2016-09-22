using Alexa2016.SpeachAssets;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Alexa2016.Controllers
{
	public class AlexaController : ApiController
	{
		[HttpPost, Route("api/alexa/demo")]
		public dynamic test(dynamic request)
		{
			AlexaRequest alexaRequest = Newtonsoft.Json.JsonConvert.DeserializeObject<AlexaRequest>(request.ToString());

			try
			{
				switch (alexaRequest.request.type)
				{
					case "LaunchRequest":
						return GetLaunchResponse(request);
					case "IntentRequest":
						return GetIntentResponse(request);
					case "SessionEndedRequest":
						return null;
					default:
						return GetResponseObject("You drive me mad, What are you talking about?",false);

				}
			}
			catch (Exception ex)
			{
				string msg = ex.Message;
				return GetResponseObject("Something bad happened please call Masoud.");
			}

		}

		private dynamic GetLaunchResponse(dynamic request)
		{
			LaunchRequest requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<LaunchRequest>(request.ToString());
			return GetResponseObject("Hi, Thanks for choosing Exact Online Assistant!", false);
		}

		private dynamic GetIntentResponse(dynamic request)
		{
			Rootobject requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Rootobject>(request.ToString());
			switch (requestObj.request.intent.name)
			{
				case "HelloWorldIntent":
					return GetResponseObject("Well done! It is now time to sleep!", false);
				case "GetHoroscope":
					return GetResponseObject("World is bigger than what you think", false);
				case "Math":
					return GetMatchResponse(request);
				default:
					return GetResponseObject("Should I answer that?", false);
			}
		}

		private dynamic GetMatchResponse(dynamic request)
		{
			AlexaMathRequest requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<AlexaMathRequest>(request.ToString());
			var a = int.Parse(requestObj.request.intent.slots.NumberA.value);
			var b = int.Parse(requestObj.request.intent.slots.NumberB.value);

			return GetResponseObject("The answer is: ... let me think, Maybe" + a * b, false);
		}

		private dynamic GetResponseObject(string text, bool ender = true)
		{
			return new
			{
				version = "0.1",
				sessionAttributes = new { },
				response = new
				{
					outputSpeech = new
					{
						type = "PlainText",
						text = text
					},
					card = new
					{
						type = "Simple",
						title = "Our Title",
						content = "Hello\nHere is S3P",
					},

					shouldEndSession = ender
				}
			};
		}
	}
}

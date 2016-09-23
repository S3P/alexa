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
						return GetResponseObject("You drive me mad, What are you talking about?", false);
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
			return GetSSMLResponseObject("Hi, Thanks for choosing Exact Online Assistant! How may I help you?", false);
		}

		private dynamic GetIntentResponse(dynamic request)
		{
			Rootobject requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Rootobject>(request.ToString());
			switch (requestObj.request.intent.name)
			{
				case "WhathappenedIntent":
					return GetSSMLResponseObject(GetResponseString(requestObj.request.intent.name), false);
				case "AvailableStockIntent":
					return GetSSMLResponseObject(GetResponseString(requestObj.request.intent.name), false);
				case "ScoreIntent":
					return GetSSMLResponseObject(GetResponseString(requestObj.request.intent.name), false);
				case "QuickerDeliveryIntent":
					return GetSSMLResponseObject(GetResponseString(requestObj.request.intent.name), false);
				case "DeliveryIntent":
					return GetSSMLResponseObject(GetResponseString(requestObj.request.intent.name), false);
				case "ThanksIntent":
					return GetSSMLResponseObject(GetResponseString(requestObj.request.intent.name));
				case "Math":
					return GetMathResponse(request);
				default:
					return GetResponseObject("Should I answer that?", false);
			}
		}

		private string GetResponseString(string intentString)
		{
			string text = "";
			SSMLBuilder builder = null;

			switch (intentString)
			{
				case "WhathappenedIntent":
					builder = new SSMLBuilder("It was a good evening.");
					text = builder.AddParagraph().ToString();
					builder = new SSMLBuilder("40 orders arrived, for a total amount of 1900 Euro.");
					text = text + builder.AddParagraph().ToString();
					builder = new SSMLBuilder(text);
					text = builder.AddParagraph().ToString();
					return text;
				case "AvailableStockIntent":
					builder = new SSMLBuilder("No, there is insufficient stock to deliver 5 of them. Do you want to delay delivery or place a rush order at one of your suppliers?");
					text = builder.AddParagraph().ToString();
					return text;
				case "ScoreIntent":
					builder = new SSMLBuilder("Your current score on eBay is 83%, and your target is 90%.");
					text = builder.AddParagraph().ToString();
					return text;
				case "QuickerDeliveryIntent":
					builder = new SSMLBuilder("Supplier BCC can deliver the items today, before noon.");
					text = builder.AddParagraph().ToString();
					return text;
				case "DeliveryIntent":
					builder = new SSMLBuilder("OK, purchase order to BCC was sent. Expected delivery is at noon today");
					text = builder.AddParagraph().ToString();
					return text;
				case "ThanksIntent":
					builder = new SSMLBuilder("By the way don't forget Today is Carina's birthday.");
					text = builder.AddParagraph().ToString();
					return text;
				default:
					return "";
			}
		}

		private dynamic GetMathResponse(dynamic request)
		{
			AlexaMathRequest requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<AlexaMathRequest>(request.ToString());
			var a = int.Parse(requestObj.request.intent.slots.NumberA.value);
			var b = int.Parse(requestObj.request.intent.slots.NumberB.value);

			return GetResponseObject("The answer is: ... let me think, Maybe around " + a * b, false);
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

		private dynamic GetSSMLResponseObject(string text, bool ender = false)
		{
			SSMLBuilder builder = new SpeachAssets.SSMLBuilder(text);
			builder.AddSpeak();
			string speachText = builder.ToString();
			return new
			{
				version = "0.1",
				sessionAttributes = new { },
				response = new
				{
					outputSpeech = new
					{
						type = "SSML",
						ssml = speachText
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

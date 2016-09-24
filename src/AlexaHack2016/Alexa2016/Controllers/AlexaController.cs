using Alexa2016.SpeachAssets;
using System;
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
				return GetResponseObject("Something bad happened please call Mas'oud.");
			}
		}

		private dynamic GetLaunchResponse(dynamic request)
		{
			LaunchRequest requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<LaunchRequest>(request.ToString());
			return GetSSMLResponseObject("Hi, Thanks for choosing Exact Online Assistant! How may I help you?", false);
		}

		private AmountPOCOs GetAmounts()
		{
			CallEOL call = new SpeachAssets.CallEOL();
			string value =call.test(callTypes.GetAmounts);
			AmountPOCOs values = Newtonsoft.Json.JsonConvert.DeserializeObject<AmountPOCOs>(value);
			return values;
		}

		private string GetNotes()
		{
			CallEOL call = new SpeachAssets.CallEOL();
			string value = call.test(callTypes.BakerRemark);
			NotesPoco values = Newtonsoft.Json.JsonConvert.DeserializeObject<NotesPoco>(value);

			return values.d.results[0].Remarks;
		}

		private dynamic GetIntentResponse(dynamic request)
		{
			Rootobject requestObj = Newtonsoft.Json.JsonConvert.DeserializeObject<Rootobject>(request.ToString());
			string stuff = requestObj.request.intent.name;
			switch (stuff)
			{
				case "WhathappenedIntent":
					return GetSSMLResponseObject(GetResponseString(stuff), false);
				case "AvailableStockIntent":
					return GetSSMLResponseObject(GetResponseString(stuff), false);
				case "ScoreIntent":
					return GetSSMLResponseObject(GetResponseString(stuff), false);
				case "QuickerDeliveryIntent":
					return GetSSMLResponseObject(GetResponseString(stuff), false);
				case "PurchaseIntent":
					SendMessageToBus(SeriveBusMessageType.CreatePurchaseOrder, string.Empty);
					return GetSSMLResponseObject(GetResponseString(stuff), false);
				case "ThanksIntent":
					return GetSSMLResponseObject(GetResponseString(stuff));
				case "CustomerUpdateIntent":
					return GetSSMLResponseObject(GetResponseString(stuff), false);
				case "ShowCashflowIntent":
					CallFakeEol.call("2");
					return GetSSMLResponseObject(GetResponseString(stuff), true);
				case "ShowSalesTrendIntent":
					CallFakeEol.call("3");
					return GetSSMLResponseObject(GetResponseString(stuff), true);
				case "SetReminderIntent":
					postToEOL();
					return GetSSMLResponseObject(GetResponseString(stuff), true);
				case "Math":
					return GetMathResponse(request);
				default:
					return GetResponseObject("Should I answer that?", false);
			}
		}

		private void postToEOL()
		{
			PostEOL peol = new SpeachAssets.PostEOL();
			peol.test("Remind to send a quotation to Baker");
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
				case "PurchaseIntent":
					builder = new SSMLBuilder("OK, purchase order to BCC was sent. Expected delivery is at noon today");
					text = builder.AddParagraph().ToString();
					return text;
				case "ThanksIntent":
					builder = new SSMLBuilder("By the way don't forget Today is Carina's birthday.");
					text = builder.AddParagraph().ToString();
					return text;
				case "CustomerUpdateIntent":
					var amounts = GetAmounts();
					builder = new SSMLBuilder(string.Format(GetNotes()+ "They owe you {0} Euros, of which {1} Euros is late", amounts.d.results[0].TotalAmount, amounts.d.results[0].AgeGroup2Amount));
					text = builder.AddParagraph().ToString();
					return text;
				case "ShowCashflowIntent":
					builder = new SSMLBuilder("OK, Done.");
					text = builder.AddParagraph().ToString();
					return text;
				case "ShowSalesTrendIntent":
					builder = new SSMLBuilder("OK, Done.");
					text = builder.AddParagraph().ToString();
					return text;
				case "SetReminderIntent":
					builder = new SSMLBuilder("OK, reminder set to tell Baker Electronics about audio cables.");
					text = builder.AddParagraph().ToString();
					return text;
				default:
					return "The command is not correct please try again!";
			}
		}

		private dynamic GetMathResponse(dynamic request)
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

		private dynamic GetSSMLResponseObject(string text, bool ender = false)
		{
			SSMLBuilder builder = new SpeachAssets.SSMLBuilder(text);
			builder.AddSpeak();
			builder.AddParagraph();
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
		
		public void SendMessageToBus(SeriveBusMessageType messageType,string customData)
		{
			ServicebusHandler sbh = new ServicebusHandler();
			sbh.SignalEOL(messageType, customData);
		}
	}
	public enum SeriveBusMessageType
	{
		CreatePurchaseOrder,
		ShowPopUp,

	}
}

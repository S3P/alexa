using Alexa2016.Controllers;
using Microsoft.ServiceBus.Messaging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class ServicebusHandler
	{
		private string _connectionString = "Endpoint=sb://exacthackathon.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ao/f9GmSxnYxwkaCmOGcii5QH+XsPQI5bc+zf0Pz+w0=";
		private string topicName = "incoming";//Azure channel
		private string subscriptionName = "AllMessage";

		public void SignalEOL(SeriveBusMessageType messageType, string customData)
		{
			var client = TopicClient.CreateFromConnectionString(_connectionString, topicName);
			var message = new BrokeredMessage("Enjoy");
			switch (messageType)
			{
				case SeriveBusMessageType.CreatePurchaseOrder:
					message.Properties.Add("data", "purchase");
					break;
				case SeriveBusMessageType.ShowPopUp:
					message.Properties.Add("data", "popup");
					message.Properties.Add("customdata", customData);
					break;
				default:
					break;
			}
			client.Send(message);
		}
	}
}
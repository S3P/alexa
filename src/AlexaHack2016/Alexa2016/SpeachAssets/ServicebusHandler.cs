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

		public void SignalEOL(dynamic messageData)
		{
			var client = TopicClient.CreateFromConnectionString(_connectionString, topicName);
			var message = new BrokeredMessage("This is a test message!");
			client.Send(message);
		}
	}
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class PostEOL
	{
		public void test(string reminder)
		{

			var baseAddress = "https://start.exactonline.nl/api/v1/695413/activities/Tasks";

			var http = (HttpWebRequest)WebRequest.Create(new Uri(baseAddress));

			http.Accept = "application/json";
			http.ContentType = "application/json";
			http.Method = "POST";

			http.Headers.Add("x-exactonline-applicationkey", "88d98285-4b8d-43f9-b36d-9220b12c7f1c");

			var byteArray = Encoding.ASCII.GetBytes("perftest4:Hackathon");
			http.Headers.Add("Authorization", "Basic " + Convert.ToBase64String(byteArray));

			//http.Headers.Add("x-exactonline-applicationkey", "88d98285-4b8d-43f9-b36d-9220b12c7f1c");

			string parsedContent = string.Format("{Description:'{0}'}", reminder);
			ASCIIEncoding encoding = new ASCIIEncoding();
			Byte[] bytes = encoding.GetBytes(parsedContent);

			Stream newStream = http.GetRequestStream();
			newStream.Write(bytes, 0, bytes.Length);
			newStream.Close();

			var response = http.GetResponse();

			var stream = response.GetResponseStream();
			var sr = new StreamReader(stream);
			var content = sr.ReadToEnd();


			//HttpClientHandler handler = new HttpClientHandler()
			//{
			//	PreAuthenticate = true,
			//	UseDefaultCredentials = true
			//};


			//string reasonPhrase = "";
			//using (var client = new HttpClient(handler))
			//{
			//	client.BaseAddress = new Uri("https://start.exactonline.nl/");
			//	var byteArray = Encoding.ASCII.GetBytes("perftest4:Hackathon");
			//	client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

			//	//client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("base64", "cGVyZnRlc3Q0OkhhY2thdGhvbg==");
			//	client.DefaultRequestHeaders.Add("x-exactonline-applicationkey", "88d98285-4b8d-43f9-b36d-9220b12c7f1c");
			//	//client.DefaultRequestHeaders.Accept.Clear();
			//	//client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
			//	client.DefaultRequestHeaders.Add("Content-Type", "application/json");
			//	client.DefaultRequestHeaders.Add("Accept", "application/json");

			//	// GET
			//	//var response = client.GetAsync("https://start.exactonline.nl/api/v1/695413/activities/Tasks").Result;
			//	// Post
			//	var response = client.PostAsJsonAsync("https://start.exactonline.nl/api/v1/695413/activities/Tasks", GetObject(reminder)).Result;

			//	if (response.IsSuccessStatusCode)
			//	{
			//		var result = response.Content.ReadAsStringAsync().Result;
			//		return result;
			//	}
			//	else
			//	{
			//		reasonPhrase = response.ReasonPhrase;
			//		if (reasonPhrase.ToUpper() == "UNAUTHORIZED")
			//		{
			//			throw new Exception("Not authorized");
			//		}

			//		throw new Exception("Something is wrong");
			//	}
			//}
		}
		private string GetObject(string reminder)
		{
			//dynamic x = new
			//{
			//	Description = "\'" + reminder + "\'"
			//};

			return string.Format("{Description:'{0}'}", reminder);

			//return Newtonsoft.Json.JsonConvert.SerializeObject(x);
		}
	}
}
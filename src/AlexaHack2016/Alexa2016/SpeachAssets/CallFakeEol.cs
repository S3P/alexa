using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class CallFakeEol
	{
		public static string call(string number)
		{
			HttpClientHandler handler = new HttpClientHandler()
			{
				PreAuthenticate = true,
				UseDefaultCredentials = true
			};


			string reasonPhrase = "";
			using (var client = new HttpClient(handler))
			{
				client.BaseAddress = new Uri("http://fakeeolalexa.azurewebsites.net/");
				var byteArray = Encoding.ASCII.GetBytes("perftest4:Hackathon");
				//client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));

				//client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("base64", "cGVyZnRlc3Q0OkhhY2thdGhvbg==");
				//client.DefaultRequestHeaders.Add("x-exactonline-applicationkey", "88d98285-4b8d-43f9-b36d-9220b12c7f1c");
				//client.DefaultRequestHeaders.Accept.Clear();
				//client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

				// GET
				var response = client.GetAsync("http://fakeeolalexa.azurewebsites.net/Home/Set?a="+number).Result;
				// Post
				// var response = client.PostAsJsonAsync("http://localhost/endpoint", obj).Result;

				if (response.IsSuccessStatusCode)
				{
					var result = response.Content.ReadAsStringAsync().Result;
					return result;
				}
				else
				{
					reasonPhrase = response.ReasonPhrase;
					if (reasonPhrase.ToUpper() == "UNAUTHORIZED")
					{
						throw new Exception("Not authorized");
					}

					throw new Exception("Something is wrong");
				}
			}
		}
	}
}
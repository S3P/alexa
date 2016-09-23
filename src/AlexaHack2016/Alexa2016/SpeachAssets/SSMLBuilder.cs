using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Alexa2016.SpeachAssets
{
	public class SSMLBuilder
	{
		private string text;

		private Stack<Tokens> tokenStack;

		public SSMLBuilder()
		{
			tokenStack = new Stack<SpeachAssets.Tokens>();
		}

		public SSMLBuilder(string text)
		{
			this.text = text;
			tokenStack = new Stack<Tokens>();
		}

		public SSMLBuilder AddSpeak()
		{
			tokenStack.Push(Tokens.Speak);
			return this;
		}

		public SSMLBuilder AddParagraph()
		{
			tokenStack.Push(Tokens.Paragraph);
			return this;
		}

		public SSMLBuilder AddBreak()
		{
			tokenStack.Push(Tokens.Break);
			return this;
		}

		private string GetSpeak(string text)
		{
			return $"<speak>{text}</speak>";
		}

		private string GetParagraph(string text)
		{
			return $"<p>{text}</p>";
		}

		private string GetBreakInSeconds(string text, int seconds)
		{
			return $"{text} <break time=\"{seconds}s\" />";
		}

		public override string ToString()
		{
			Tokens t;
			string outputText = text;
			try
			{
				t = tokenStack.Pop();
				while (true)
				{
					switch (t)
					{
						case Tokens.Speak:
							outputText = GetSpeak(outputText);
							break;
						case Tokens.Paragraph:
							outputText = GetParagraph(outputText);
							break;
						case Tokens.Break:
							outputText = GetBreakInSeconds(outputText, 1);
							break;
						default:
							break;
					}
					t = tokenStack.Pop();
				}
			}
			catch (InvalidOperationException ex)
			{
				return outputText;
			}
		}
	}

	enum Tokens
	{
		Speak,
		Paragraph,
		Break
	}
}
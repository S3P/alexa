using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AlexaHack2016.Startup))]
namespace AlexaHack2016
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

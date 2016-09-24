using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FakeEOLAlexa.Startup))]
namespace FakeEOLAlexa
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

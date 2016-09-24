using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(FakeExact.Startup))]
namespace FakeExact
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

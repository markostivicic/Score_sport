﻿using System;
using System.Collections.Generic;
using System.Linq;
using Autofac.Integration.WebApi;
using Autofac;
using System.Reflection;
using System.Web.Http;
using Microsoft.Owin;
using Owin;
using ResultApp.Service;

[assembly: OwinStartup(typeof(ResultApp.WebApi.Startup))]

namespace ResultApp.WebApi
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
        public static void ConfigureAutofac(HttpConfiguration config)
        {
            var builder = new ContainerBuilder();
            builder.RegisterModule<ServiceModule>();
            builder.RegisterApiControllers(Assembly.GetExecutingAssembly());
            var container = builder.Build();

            var resolver = new AutofacWebApiDependencyResolver(container);
            config.DependencyResolver = resolver;
        }
    }
}

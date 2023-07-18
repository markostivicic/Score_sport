using Autofac;
using ResultApp.Repository;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class ServiceModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterModule<RepositoryModule>();
            builder.RegisterType<SportService>().As<ISportService>();
            builder.RegisterType<LocationService>().As<ILocationService>();
            builder.RegisterType<CountryService>().As<ICountryService>();
            builder.RegisterType<ClubService>().As<IClubService>();
            builder.RegisterType<LeagueService>().As<ILeagueService>();
            builder.RegisterType<CommentService>().As<ICommentService>();
        }
    }
}

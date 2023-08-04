using Autofac;
using ResultApp.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public class RepositoryModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<SportRepository>().As<ISportRepository>();
            builder.RegisterType<LocationRepository>().As<ILocationRepository>();
            builder.RegisterType<CountryRepository>().As<ICountryRepository>();
            builder.RegisterType<MatchRepository>().As<IMatchRepository>();
            builder.RegisterType<ClubRepository>().As<IClubRepository>();
            builder.RegisterType<LeagueRepository>().As<ILeagueRepository>();
            builder.RegisterType<CommentRepository>().As<ICommentRepository>();
            builder.RegisterType<PlayerRepository>().As<IPlayerRepository>();
            builder.RegisterType<FavouriteClubRepository>().As<IFavouriteClubRepository>();
            builder.RegisterType<FavouriteMatchRepository>().As<IFavouriteMatchRepository>();
        }

    }
}

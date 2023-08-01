using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using ResultApp.Service.Common;
using ResultApp.Model;
using ResultApp.WebApi.Models.Club;
using ResultApp.Common;
using Microsoft.AspNet.Identity;
using Autofac.Core;
using ResultApp.WebApi.Models.Country;
using ResultApp.WebApi.Models.League;
using ResultApp.WebApi.Models.Location;

namespace ResultApp.WebApi.Controllers
{
    public class ClubController : ApiController
    {
        private IClubService ClubService { get; }

        public ClubController(IClubService clubService)
        {
            ClubService = clubService;
        }

        [NonAction]
        public LeagueToReturnDto MapLeagueToLeagueToReturnDto(League league)
        {
            return new LeagueToReturnDto(league.Id, league.Name, league.SportId, league.CountryId);
        }

        [NonAction]
        public LocationToReturnDto MapLocationToLocationToReturnDto(Location location)
        {
            return new LocationToReturnDto(location.Id, location.Name, location.Address, location.CountryId);
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllClubsAsync([FromUri] Sorting sorting = null, [FromUri] Paging paging = null, [FromUri] ClubFilter clubFilter = null)
        {
            PageList<Club> clubs = await ClubService.GetAllAsync(sorting, paging, clubFilter);
            List<ClubToReturnDto> clubViews = new List<ClubToReturnDto>();
            foreach (var club in clubs.Items)
            {
                clubViews.Add(new ClubToReturnDto(club.Id, club.Name, club.Logo, club.LeagueId, club.LocationId, MapLeagueToLeagueToReturnDto(club.League), MapLocationToLocationToReturnDto(club.Location)));
            }
            return Request.CreateResponse(HttpStatusCode.OK, new PageList<ClubToReturnDto>(clubViews, clubs.TotalCount));
        }

        //[Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetClubByIdAsync(Guid id)
        {
            Club club = await ClubService.GetByIdAsync(id);
            if (club == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Club with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new ClubToReturnDto(club.Id, club.Name, club.Logo, club.LeagueId, club.LocationId, MapLeagueToLeagueToReturnDto(club.League), MapLocationToLocationToReturnDto(club.Location)));
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertClubAsync([FromBody] ClubToCreateAndUpdateDto club)
        {
            if (club == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club is null!");
            }

            Club clubToInsert = new Club(Guid.NewGuid(), club.Name, club.Logo, (Guid)club.LeagueId, (Guid)club.LocationId, User.Identity.GetUserId());

            int affectedRows = await ClubService.InsertAsync(clubToInsert);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Club was inserted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club was not inserted!");
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<HttpResponseMessage> UpdateClubAsync(Guid id, [FromBody] ClubToCreateAndUpdateDto club)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }
            if (club == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club is null!");
            }

            Club clubById = await ClubService.GetByIdAsync(id);
            if (clubById == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club with that id was not found!");
            }
            string name = club.Name;
            string logo = club.Logo;
            Guid? leagueId = club.LeagueId;
            Guid? locationId = club.LocationId;
            if (name == null)
            {
                name = clubById.Name;
            }
            if (logo == null)
            {
                logo = clubById.Logo;
            }
            if (leagueId == null)
            {
                leagueId = clubById.LeagueId;
            }
            if (locationId == null)
            {
                locationId = clubById.LocationId;
            }


            Club clubToUpdate = new Club(id, name, logo, (Guid)leagueId, (Guid)locationId, User.Identity.GetUserId(), DateTime.Now);

            int affectedRows = await ClubService.UpdateAsync(id, clubToUpdate);
            if (affectedRows == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Club with that ID was not found!");
            }
            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Club was updated. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club was not updated!");
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/club/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await ClubService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Club status changed");
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}

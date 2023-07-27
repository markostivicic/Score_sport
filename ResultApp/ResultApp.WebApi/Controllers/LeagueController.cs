using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using ResultApp.WebApi.Models.League;
using ResultApp.WebApi.Models.Country;
using ResultApp.WebApi.Models.Sport;
using Microsoft.AspNet.Identity;
using Autofac.Core;
using System.Web.UI.WebControls.WebParts;

namespace ResultApp.WebApi.Controllers
{
    public class LeagueController : ApiController
    {
        private ILeagueService LeagueService { get; }

        public LeagueController(ILeagueService leagueService)
        {
            LeagueService = leagueService;
        }

        [NonAction]
        public CountryToReturnDto MapCountryToCountryToReturnDto(Country country)
        {
            return new CountryToReturnDto(country.Id, country.Name);
        }
        [NonAction]
        public SportToReturnDto MapSportToSportToReturnDto(Sport sport)
        {
            return new SportToReturnDto(sport.Id, sport.Name);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllLeaguesAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] LeagueFilter leagueFilter)
        {
            PageList<League> leagues = await LeagueService.GetAllAsync(sorting, paging, leagueFilter);
            List<LeagueToReturnDto> leagueViews = new List<LeagueToReturnDto>();
            foreach (var league in leagues.Items)
            {
                leagueViews.Add(new LeagueToReturnDto(league.Id, league.Name, league.SportId, league.CountryId, MapCountryToCountryToReturnDto(league.Country), MapSportToSportToReturnDto(league.Sport)));
            }
            return Request.CreateResponse(HttpStatusCode.OK, new PageList<LeagueToReturnDto>(leagueViews, leagues.TotalCount));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetLeagueByIdAsync(Guid id)
        {
            League league = await LeagueService.GetByIdAsync(id);
            if (league == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "League with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new LeagueToReturnDto(league.Id, league.Name, league.SportId, league.CountryId, MapCountryToCountryToReturnDto(league.Country), MapSportToSportToReturnDto(league.Sport)));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertLeagueAsync([FromBody] LeagueToCreateAndUpdateDto league)
        {
            if (league == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League is null!");
            }

            League leagueToInsert = new League(Guid.NewGuid(), league.Name, (Guid)league.SportId, (Guid)league.CountryId, User.Identity.GetUserId());

            int affectedRows = await LeagueService.InsertAsync(leagueToInsert);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"League was inserted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League was not inserted!");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<HttpResponseMessage> UpdateLeagueAsync(Guid id, [FromBody] LeagueToCreateAndUpdateDto league)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }
            if (league == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League is null!");
            }

            League leagueById = await LeagueService.GetByIdAsync(id);
            if (leagueById == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League with that id was not found!");
            }
            string name = league.Name;
            Guid? sportId = league.SportId;
            Guid? countryId = league.CountryId;
            if(name == null)
            {
                name = leagueById.Name;
            }
            if(sportId == null)
            {
                sportId = leagueById.SportId;
            }
            if(countryId == null)
            {
                countryId = leagueById.CountryId;
            }

            League leagueToUpdate = new League(id, name, (Guid)sportId, (Guid)countryId, User.Identity.GetUserId(), DateTime.Now);

            int affectedRows = await LeagueService.UpdateAsync(id, leagueToUpdate);
            if (affectedRows == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "League with that ID was not found!");
            }
            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"League was updated. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League was not updated!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/league/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await LeagueService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "League status changed");
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
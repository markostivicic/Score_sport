using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using ResultApp.WebApi.Models.LeagueModels;

namespace ResultApp.WebApi.Controllers
{
    [Authorize]
    public class LeagueController : ApiController
    {
        private ILeagueService LeagueService { get; }

        public LeagueController(ILeagueService leagueService)
        {
            LeagueService = leagueService;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllLeagues(Guid? sportId = null, bool isActive = true)
        {
            LeagueFilter filter = new LeagueFilter(sportId, isActive);

            List<League> leagues = await LeagueService.GetAllAsync(filter);
            if (leagues.Count <= 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No leagues found.");
            }

            List<LeagueToReturnDto> leagueViews = new List<LeagueToReturnDto>();
            foreach (var league in leagues)
            {
                leagueViews.Add(new LeagueToReturnDto(league.Name, league.SportId, league.CountryId));
            }
            return Request.CreateResponse(HttpStatusCode.OK, leagueViews);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetLeagueById(Guid id)
        {
            League league = await LeagueService.GetByIdAsync(id);
            if (league == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "League with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new LeagueToReturnDto(league.Name, league.SportId, league.CountryId));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> InsertLeague([FromBody] LeagueToCreateAndUpdateDto league)
        {
            if (league == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League is null!");
            }

            League leagueToInsert = new League(Guid.NewGuid(), league.Name, (Guid)league.SportId, (Guid)league.CountryId);

            int affectedRows = await LeagueService.InsertAsync(leagueToInsert);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"League was inserted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "League was not inserted!");
        }

        [HttpPut]
        public async Task<HttpResponseMessage> UpdateLeague(Guid id, [FromBody] LeagueToCreateAndUpdateDto league)
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

            League leagueToUpdate = new League(id, name, (Guid)sportId, (Guid)countryId);

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

        [HttpDelete]
        public async Task<HttpResponseMessage> DeleteLeague(Guid id)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }

            int affectedRows = await LeagueService.DeleteAsync(id);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Club was deleted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club was not deleted!");
        }
    }
}
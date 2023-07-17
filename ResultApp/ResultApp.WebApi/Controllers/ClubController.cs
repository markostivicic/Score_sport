using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web.Http;
using ResultApp.Service.Common;
using ResultApp.Model;
using ResultApp.WebApi.Models.ClubModels;
using ResultApp.Common;

namespace ResultApp.WebApi.Controllers
{
    public class ClubController : ApiController
    {
        private IClubService ClubService { get; }

        public ClubController(IClubService clubService)
        {
            ClubService = clubService;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllClubs(Guid? leagueId = null, Guid? sportId = null, bool isActive = true)
        {
            ClubFilter filter = new ClubFilter(leagueId, sportId, isActive);

            List<Club> clubs = await ClubService.GetAllAsync(filter);
            if (clubs.Count <= 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No clubs found.");
            }

            List<ClubToReturnDto> clubViews = new List<ClubToReturnDto>();
            foreach (var club in clubs)
            {
                clubViews.Add(new ClubToReturnDto(club.Name, club.Logo, club.LeagueId, club.LocationId));
            }
            return Request.CreateResponse(HttpStatusCode.OK, clubViews);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetClubById(Guid id)
        {
            Club club = await ClubService.GetByIdAsync(id);
            if (club == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Club with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new ClubToReturnDto(club.Name, club.Logo, club.LeagueId, club.LocationId));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> InsertClub([FromBody] ClubToCreateDto club)
        {
            if (club == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club is null!");
            }
            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, "Fields can't be empty!");
            }
            Club clubToInsert = new Club(Guid.NewGuid(), club.Name, club.Logo, club.LeagueId, club.LocationId);

            int affectedRows = await ClubService.InsertAsync(clubToInsert);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Club was inserted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club was not inserted!");
        }

        [HttpPut]
        public async Task<HttpResponseMessage> UpdateClub(Guid id, [FromBody] ClubToUpdateDto club)
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

            Club clubToUpdate = new Club(id, club.Name, club.Logo, clubById.LeagueId, clubById.LocationId);

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

        [HttpDelete]
        public async Task<HttpResponseMessage> DeleteClub(Guid id)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }

            int affectedRows = await ClubService.DeleteAsync(id);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Club was deleted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Club was not deleted!");
        }
    }
}

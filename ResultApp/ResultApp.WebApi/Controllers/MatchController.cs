using Autofac.Core;
using Microsoft.AspNet.Identity;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models.Club;
using ResultApp.WebApi.Models.Country;
using ResultApp.WebApi.Models.Location;
using ResultApp.WebApi.Models.Match;
using ResultApp.WebApi.Models.Sport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResultApp.WebApi.Controllers
{
    public class MatchController : ApiController
    {
        [NonAction]
        private IEnumerable<MatchToReturnDto> MapMatchToMatchToReturn(List<Match> matches)
        {
            return matches.Select(match => new MatchToReturnDto(match.Id, match.HomeScore, match.AwayScore, match.Time,
                match.LocationId, match.ClubHomeId, match.ClubAwayId, MapLocationToLocationToReturnDto(match.Location), MapClubToClubToReturnDto(match.ClubHome), MapClubToClubToReturnDto(match.ClubAway)));
        }

        private readonly IMatchService _matchService;
        public MatchController(IMatchService matchService)
        {
            _matchService = matchService;
        }

        [NonAction]
        public ClubToReturnDto MapClubToClubToReturnDto(Club club)
        {
            return new ClubToReturnDto(club.Id, club.Name, club.Logo, club.LeagueId, club.LocationId);
        }
        [NonAction]
        public LocationToReturnDto MapLocationToLocationToReturnDto(Location location)
        {
            return new LocationToReturnDto(location.Id, location.Name, location.Address, location.CountryId);
        }

        [Authorize(Roles = "User,Admin")]
        public async Task<HttpResponseMessage> GetAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] MatchFilter matchFilter)
        {
            try
            {
                PageList<Match> matches = await _matchService.GetAllAsync(sorting, paging, matchFilter);
                List<MatchToReturnDto> results = new List<MatchToReturnDto>();
                foreach (var match in matches.Items)
                {
                    results.Add(new MatchToReturnDto(match.Id, match.HomeScore, match.AwayScore, match.Time, match.LocationId, match.ClubHomeId, match.ClubAwayId, MapLocationToLocationToReturnDto(match.Location), MapClubToClubToReturnDto(match.ClubHome), MapClubToClubToReturnDto(match.ClubAway)));
                }
                return Request.CreateResponse(HttpStatusCode.OK, new PageList<MatchToReturnDto>(results, matches.TotalCount));
        }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [Authorize(Roles = "User,Admin")]
        public async Task<HttpResponseMessage> GetAsync(Guid id)
        {
            try
            {
                Match match = await _matchService.GetByIdAsync(id);
                if (match != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapMatchToMatchToReturn(new List<Match> { match }).First());
                }
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Item doesnt exist");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [Authorize(Roles = "Admin")]
        public async Task<HttpResponseMessage> PostAsync([FromBody] MatchToCreateDto match)
        {
            try
            {
                Match mappedMatch = new Match(Guid.NewGuid(), match.Time,
                match.LocationId, match.ClubHomeId, match.ClubAwayId, User.Identity.GetUserId(), match.HomeScore, match.AwayScore);
                Match newMatch = await _matchService.CreateAsync(mappedMatch);
                if (newMatch != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Match inserted");
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [Authorize(Roles = "Admin")]
        public async Task<HttpResponseMessage> PutAsync(Guid id, [FromBody] MatchToUpdateDto match)
        {
            try
            {
                Match matchInDatabase = await _matchService.GetByIdAsync(id);
                if(matchInDatabase == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
                }

                int? homeScore = match.HomeScore;
                int? awayScore = match.AwayScore;
                DateTime? time = match.Time;
                Guid? locationId = match.LocationId;
                Guid? clubHomeId = match.ClubHomeId;
                Guid? clubAwayId = match.ClubAwayId;
                if(homeScore == null)
                {
                    homeScore = matchInDatabase.HomeScore;
                }
                if (awayScore== null)
                {
                    awayScore = matchInDatabase.AwayScore;
                }
                if (time == null)
                {
                    time = matchInDatabase.Time;
                }
                if (locationId == null)
                {
                    locationId = matchInDatabase.LocationId;
                }
                if (clubHomeId == null)
                {
                    clubHomeId = matchInDatabase.ClubHomeId;
                }
                if (clubAwayId == null)
                {
                    clubAwayId = matchInDatabase.ClubAwayId;
                }

                Match mappedMatch = new Match(id, homeScore, awayScore, (DateTime)time, (Guid)locationId,
                    (Guid)clubHomeId, (Guid)clubAwayId, User.Identity.GetUserId(), DateTime.Now);
                Match updatedMatch = await _matchService.UpdateAsync(id, mappedMatch);

                if (mappedMatch != null)
                {
                    return Request.CreateResponse(HttpStatusCode.NoContent);
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/match/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await _matchService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Sport status changed");
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

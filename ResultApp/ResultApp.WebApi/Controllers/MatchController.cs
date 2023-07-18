using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
using ResultApp.Model;
using ResultApp.Service;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models.Country;
using ResultApp.WebApi.Models.Match;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResultApp.WebApi.Controllers
{
    [Authorize]
    public class MatchController : ApiController
    {
        private static IEnumerable<MatchToReturnDto> MapMatchToMatchToReturn(List<Match> matches)
        {
            return matches.Select(match => new MatchToReturnDto(match.Id, match.Time,
                match.LocationId, match.ClubHomeId, match.ClubAwayId, match.HomeScore, match.AwayScore));
        }

        private readonly IMatchService _matchService;
        public MatchController(IMatchService matchService)
        {
            _matchService = matchService;
        }
        // GET: api/Match
        public async Task<HttpResponseMessage> Get()
        {
            //try
            //{
                List<Match> matches = await _matchService.GetAllAsync();
                return Request.CreateResponse(HttpStatusCode.OK, MapMatchToMatchToReturn(matches));
            //}
            /*catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }*/

        }

        // GET: api/Match/5
        public async Task<HttpResponseMessage> Get(Guid id)
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
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
            }

        }

        // POST: api/Match
        public async Task<HttpResponseMessage> Post([FromBody] MatchToCreateDto match)
        {
            try
            {
                Match mappedMatch = new Match(Guid.NewGuid(), match.Time,
                match.LocationId, match.ClubHomeId, match.ClubAwayId, User.Identity.GetUserId());
                Match newMatch = await _matchService.CreateAsync(mappedMatch);
                if (newMatch != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapMatchToMatchToReturn(new List<Match> { newMatch }).First());
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        // PUT: api/Match/5
        public async Task<HttpResponseMessage> Put(Guid id, [FromBody] MatchToUpdateDto match)
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
                if (clubHomeId == null)
                {
                    clubHomeId = matchInDatabase.ClubHomeId;
                }

                Match mappedMatch = new Match(id, (int)homeScore, (int)awayScore, (DateTime)time, (Guid)locationId,
                    (Guid)clubHomeId, (Guid)clubAwayId, User.Identity.GetUserId(), DateTime.Now);
                Match updatedMatch = await _matchService.UpdateAsync(id, mappedMatch);

                if (mappedMatch != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapMatchToMatchToReturn(new List<Match> { updatedMatch }).First());
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
            }
        }

        // DELETE: api/Match/5
        public async Task<HttpResponseMessage> Delete(Guid id)
        {
            try
            {
                bool isSuccess = await _matchService.DeleteAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.NoContent);
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
            }
        }
    }
}

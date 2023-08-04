using Microsoft.AspNet.Identity;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models.Match;
using ResultApp.WebApi.Models.FavouriteMatch;
using ResultApp.WebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResultApp.WebApi.Controllers
{
    public class FavouriteMatchController : ApiController
    {
        private IFavouriteMatchService FavouriteMatchService { get; }

        public FavouriteMatchController(IFavouriteMatchService favouriteMatchService)
        {
            FavouriteMatchService = favouriteMatchService;
        }

        private MatchToReturnDto MapMatchToMatchToReturnDto(Match match)
        {
            return new MatchToReturnDto(match.Id, match.HomeScore, match.AwayScore, match.Time, match.LocationId, match.ClubHomeId, match.ClubAwayId);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllFavouriteMatchsAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] FavouriteMatchFilter favouriteMatchFilter)
        {
            PageList<FavouriteMatch> favouriteMatchs = await FavouriteMatchService.GetAllFavouriteMatchsAsync(sorting, paging, favouriteMatchFilter, User.Identity.GetUserId());
            List<FavouriteMatchToReturnDto> favouriteMatchViews = new List<FavouriteMatchToReturnDto>();
            foreach (var favouriteMatch in favouriteMatchs.Items)
            {
                favouriteMatchViews.Add(new FavouriteMatchToReturnDto(favouriteMatch.Id, favouriteMatch.MatchId, favouriteMatch.CreatedByUserId, MapMatchToMatchToReturnDto(favouriteMatch.Match)));
            }
            return Request.CreateResponse(HttpStatusCode.OK, new PageList<FavouriteMatchToReturnDto>(favouriteMatchViews, favouriteMatchs.TotalCount));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFavouriteMatchByIdAsync(Guid id)
        {
            FavouriteMatch favouriteMatch = await FavouriteMatchService.GetFavouriteMatchByIdAsync(id);
            if (favouriteMatch == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Favourite match with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new FavouriteMatchToReturnDto(favouriteMatch.Id, favouriteMatch.MatchId, favouriteMatch.CreatedByUserId, MapMatchToMatchToReturnDto(favouriteMatch.Match)));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> PostFavouriteMatchAsync([FromBody] FavouriteMatchToCreateAndUpdate favouriteMatch)
        {
            if (favouriteMatch == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Favourite match is null!");
            }

            FavouriteMatch favouriteMatchToInsert = new FavouriteMatch(Guid.NewGuid(), (Guid)favouriteMatch.MatchId, User.Identity.GetUserId());

            int numberOfAffectedRows = await FavouriteMatchService.PostFavouriteMatchAsync(favouriteMatchToInsert);

            if (numberOfAffectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Favourite match was inserted. Affected rows: {numberOfAffectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Favourite match was not inserted!");
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete]
        [Route("api/favouritematch/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await FavouriteMatchService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "FavouriteMatch status changed");
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

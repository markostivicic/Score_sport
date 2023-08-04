using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models.Comment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using ResultApp.WebApi.Models;
using ResultApp.WebApi.Models.FavouriteClub;
using ResultApp.WebApi.Models.Club;

namespace ResultApp.WebApi.Controllers
{
    public class FavouriteClubController : ApiController
    {
        private IFavouriteClubService FavouriteClubService { get; }

        public FavouriteClubController(IFavouriteClubService favouriteClubService)
        {
            FavouriteClubService = favouriteClubService;
        }

        private ClubToReturnDto MapClubToClubToReturnDto(Club club)
        {
            return new ClubToReturnDto(club.Id, club.Name, club.Logo, club.LeagueId, club.LocationId);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllFavouriteClubsAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] FavouriteClubFilter favouriteClubFilter)
        {
            PageList<FavouriteClub> favouriteClubs = await FavouriteClubService.GetAllFavouriteClubsAsync(sorting, paging, favouriteClubFilter, User.Identity.GetUserId());
            List<FavouriteClubToReturnDto> favouriteClubViews = new List<FavouriteClubToReturnDto>();
            foreach (var favouriteClub in favouriteClubs.Items)
            {
                favouriteClubViews.Add(new FavouriteClubToReturnDto(favouriteClub.Id, favouriteClub.ClubId, favouriteClub.CreatedByUserId, MapClubToClubToReturnDto(favouriteClub.Club)));
            }
            return Request.CreateResponse(HttpStatusCode.OK, new PageList<FavouriteClubToReturnDto>(favouriteClubViews, favouriteClubs.TotalCount));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetFavouriteClubByIdAsync(Guid id)
        {
            FavouriteClub favouriteClub = await FavouriteClubService.GetFavouriteClubByIdAsync(id);
            if (favouriteClub == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Favourite club with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new FavouriteClubToReturnDto(favouriteClub.Id, favouriteClub.ClubId, favouriteClub.CreatedByUserId, MapClubToClubToReturnDto(favouriteClub.Club)));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> PostFavouriteClubAsync([FromBody] FavouriteClubToCreateAndUpdate favouriteClub)
        {
            if (favouriteClub == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Favourite club is null!");
            }

            FavouriteClub favouriteClubToInsert = new FavouriteClub(Guid.NewGuid(), (Guid)favouriteClub.ClubId, User.Identity.GetUserId());

            int numberOfAffectedRows = await FavouriteClubService.PostFavouriteClubAsync(favouriteClubToInsert);

            if (numberOfAffectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Favourite club was inserted. Affected rows: {numberOfAffectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Favourite club was not inserted!");
        }

        [Authorize(Roles = "User,Admin")]
        [HttpDelete]
        [Route("api/favouriteclub/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await FavouriteClubService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "FavouriteClub status changed");
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

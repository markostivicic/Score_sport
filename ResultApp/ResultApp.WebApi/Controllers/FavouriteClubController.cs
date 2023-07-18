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

namespace ResultApp.WebApi.Controllers
{
    public class FavouriteClubController : ApiController
    {
        private IFavouriteClubService FavouriteClubService { get; }

        public FavouriteClubController(IFavouriteClubService favouriteClubService)
        {
            FavouriteClubService = favouriteClubService;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllFavouriteClubsAsync(string userId = null, bool isActive = true)
        {
            FavouriteClubFilter filter = new FavouriteClubFilter(userId, isActive);

            List<FavouriteClub> favouriteClubs = await FavouriteClubService.GetAllFavouriteClubsAsync(filter);
            if (favouriteClubs.Count <= 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No favourite clubs found.");
            }

            List<FavouriteClubToReturnDto> favouriteClubViews = new List<FavouriteClubToReturnDto>();
            foreach (var favouriteClub in favouriteClubs)
            {
                favouriteClubViews.Add(new FavouriteClubToReturnDto(favouriteClub.ClubId, favouriteClub.CreatedByUserId));
            }
            return Request.CreateResponse(HttpStatusCode.OK, favouriteClubViews);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetFavouriteClubByIdAsync(Guid id)
        {
            FavouriteClub favouriteClub = await FavouriteClubService.GetFavouriteClubByIdAsync(id);
            if (favouriteClub == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Favourite club with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new FavouriteClubToReturnDto(favouriteClub.ClubId, favouriteClub.CreatedByUserId));
        }

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

        [HttpDelete]
        public async Task<HttpResponseMessage> DeleteFavouriteClubAsync(Guid id)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }

            int numberOfAffectedRows = await FavouriteClubService.DeleteFavouriteClubAsync(id);

            if (numberOfAffectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Favourite club was deleted. Affected rows: {numberOfAffectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Favourite club was not deleted!");
        }
    }
}

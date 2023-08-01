using Autofac.Core;
using Microsoft.AspNet.Identity;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models;
using ResultApp.WebApi.Models.Club;
using ResultApp.WebApi.Models.Country;
using ResultApp.WebApi.Models.Player;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResultApp.WebApi.Controllers
{
    public class PlayerController : ApiController
    {
        private IPlayerService PlayerService { get; }

        public PlayerController(IPlayerService playerService)
        {
            PlayerService = playerService;
        }

        private ClubToReturnDto MapClubToClubToReturnDto(Club club)
        {
            return new ClubToReturnDto(club.Id, club.Name, club.Logo, club.LeagueId, club.LocationId);
        }

        private CountryToReturnDto MapCountryToCountryToReturnDto(Country country)
        {
            return new CountryToReturnDto(country.Id, country.Name);
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllPlayersAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] PlayerFilter playerFilter)
        {

            PageList<Player> players = await PlayerService.GetPlayersAsync(sorting, paging, playerFilter);
            List<PlayerToReturnDto> playerViews = new List<PlayerToReturnDto>();
            foreach (var player in players.Items)
            {
                playerViews.Add(new PlayerToReturnDto(player.Id,player.FirstName, player.LastName, player.Image, player.DoB, player.ClubId, player.CountryId, MapClubToClubToReturnDto(player.Club), MapCountryToCountryToReturnDto(player.Country)));
            }
            return Request.CreateResponse(HttpStatusCode.OK, new PageList<PlayerToReturnDto>(playerViews, players.TotalCount));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetPlayerByIdAsync(Guid id)
        {
            Player player = await PlayerService.GetPlayerByIdAsync(id);
            if (player == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Player with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new PlayerToReturnDto(player.Id, player.FirstName, player.LastName, player.Image, player.DoB, player.ClubId, player.CountryId, MapClubToClubToReturnDto(player.Club), MapCountryToCountryToReturnDto(player.Country)));
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> PostPlayerAsync([FromBody] PlayerToCreateAndUpdateDto player)
        {
            if (player == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Player is null!");
            }

            Player playerToInsert = new Player(Guid.NewGuid(), player.FirstName, player.LastName, player.Image, player.DoB, (Guid)player.ClubId, (Guid)player.CountryId, User.Identity.GetUserId());

            int numberOfAffectedRows = await PlayerService.PostPlayerAsync(playerToInsert);

            if (numberOfAffectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Player was inserted. Affected rows: {numberOfAffectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Player was not inserted!");
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<HttpResponseMessage> UpdatePlayerAsync(Guid id, [FromBody] PlayerToCreateAndUpdateDto player)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }
            if (player == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Player is null!");
            }

            Player playerById = await PlayerService.GetPlayerByIdAsync(id);
            if (playerById == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Player with that id was not found!");
            }
            string firstName = player.FirstName;
            string lastName = player.LastName;
            string image = player.Image;
            DateTime doB = player.DoB;
            Guid? clubId = player.ClubId;
            Guid? countryId = player.CountryId;
            if (firstName == null)
            {
                firstName = playerById.FirstName;
            }
            if (lastName == null)
            {
                lastName = playerById.LastName;
            }
            if (image == null)
            {
                image = playerById.Image;
            }
            if(doB == null)
            {
                doB = playerById.DoB;
            }
            if (clubId == null)
            {
                clubId = playerById.ClubId;
            }
            if (countryId == null)
            {
                countryId = playerById.CountryId;
            }

            Player playerToUpdate = new Player(id, firstName, lastName, image, doB, (Guid)clubId, (Guid)countryId, User.Identity.GetUserId(), DateTime.Now);

            int numberOfAffectedRows = await PlayerService.UpdatePlayerAsync(id, playerToUpdate);
            if (numberOfAffectedRows == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Player with that ID was not found!");
            }
            if (numberOfAffectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Player was updated. Affected rows: {numberOfAffectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Player was not updated!");
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("api/player/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await PlayerService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Player status changed");
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

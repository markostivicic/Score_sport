using Microsoft.AspNet.Identity;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models;
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
    [Authorize]
    public class PlayerController : ApiController
    {
        private IPlayerService PlayerService { get; }

        public PlayerController(IPlayerService playerService)
        {
            PlayerService = playerService;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllPlayersAsync(Guid? clubId = null, bool isActive = true)
        {
            PlayerFilter filter = new PlayerFilter(clubId, isActive);

            List<Player> players = await PlayerService.GetPlayersAsync(filter);
            if (players.Count <= 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No players found.");
            }

            List<PlayerToReturnDto> playerViews = new List<PlayerToReturnDto>();
            foreach (var player in players)
            {
                playerViews.Add(new PlayerToReturnDto(player.FirstName, player.LastName, player.Image, player.DoB, player.ClubId, player.CountryId));
            }
            return Request.CreateResponse(HttpStatusCode.OK, playerViews);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetPlayerByIdAsync(Guid id)
        {
            Player player = await PlayerService.GetPlayerByIdAsync(id);
            if (player == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Player with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new PlayerToReturnDto(player.FirstName, player.LastName, player.Image, player.DoB, player.ClubId, player.CountryId));
        }

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

        [HttpDelete]
        public async Task<HttpResponseMessage> DeletePlayerAsync(Guid id)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }

            int numberOfAffectedRows = await PlayerService.DeletePlayerAsync(id);

            if (numberOfAffectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Player was deleted. Affected rows: {numberOfAffectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Player was not deleted!");
        }
    }
}

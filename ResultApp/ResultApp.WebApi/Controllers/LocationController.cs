using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service;
using ResultApp.WebApi.Models.Location;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.UI.WebControls.WebParts;
using Microsoft.AspNet.Identity;
using ResultApp.WebApi.Models.Country;

namespace ResultApp.WebApi.Controllers
{
    public class LocationController : ApiController
    {
        private ILocationService _service;

        public LocationController(ILocationService service)
        {
            _service = service;
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllLocationAsync([FromUri] Sorting sorting, [FromUri] Paging paging = null, [FromUri] LocationFilter locationFilter = null)
        {
            try
            {
                PageList<Location> locations = await _service.GetAllAsync(sorting, paging, locationFilter);
                List<LocationToReturnDto> locationToReturnDtos = new List<LocationToReturnDto>();
                foreach (var location in locations.Items)
                {
                    locationToReturnDtos.Add(new LocationToReturnDto(location.Id, location.Name, location.Address, location.CountryId, new CountryToReturnDto(location.CountryId, location.Country.Name)));
                }
                return Request.CreateResponse(HttpStatusCode.OK, new PageList<LocationToReturnDto>(locationToReturnDtos, locations.TotalCount));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        [Route("api/location/{id}")]
        public async Task<HttpResponseMessage> GetLocationAsync(Guid id)
        {
            try
            {
                Location location = await _service.GetByIdAsync(id);
                if (location != null)
                {
                    LocationToReturnDto locationToReturn = new LocationToReturnDto(location.Id, location.Name, location.Address, location.CountryId, new CountryToReturnDto(location.CountryId, location.Country.Name));
                    return Request.CreateResponse(HttpStatusCode.OK, locationToReturn);
                }

                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Location doesnt exist");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> CreateLocationAsync([FromBody] LocationToCreateAndUpdateDto locationToCreateAndUpdateDto)
        {
            try
            {
                Location mappedLocation = new Location(Guid.NewGuid(), locationToCreateAndUpdateDto.Name, locationToCreateAndUpdateDto.Address, (Guid)locationToCreateAndUpdateDto.CountryId, User.Identity.GetUserId());
                Location newLocation = await _service.CreateAsync(mappedLocation);
                if (newLocation != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Location created!");
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("api/location/{id}")]
        public async Task<HttpResponseMessage> UpdateLocationAsync(Guid id, [FromBody] LocationToCreateAndUpdateDto locationToCreateAndUpdateDto)
        {
            try
            {
                Location locationInDatabase = await _service.GetByIdAsync(id);
                if (locationInDatabase == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
                }
                if (locationToCreateAndUpdateDto.Name != null) locationInDatabase.Name = locationToCreateAndUpdateDto.Name;
                if (locationToCreateAndUpdateDto.Address != null) locationInDatabase.Address = locationToCreateAndUpdateDto.Address;
                if (locationToCreateAndUpdateDto.CountryId != null) locationInDatabase.CountryId = (Guid)locationToCreateAndUpdateDto.CountryId;
                Location locationToUpdate = new Location(id, locationInDatabase.Name, locationInDatabase.Address, locationInDatabase.CountryId, User.Identity.GetUserId(), DateTime.Now);
                Location updatedLocation = await _service.UpdateAsync(id, locationToUpdate);
                if (updatedLocation != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Location updated");
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
        [Route("api/location/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await _service.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Location status changed");
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

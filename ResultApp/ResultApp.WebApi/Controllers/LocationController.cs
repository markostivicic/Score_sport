using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service;
using ResultApp.WebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection.Emit;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.UI.WebControls.WebParts;

namespace ResultApp.WebApi.Controllers
{
    public class LocationController : ApiController
    {
        private ILocationService _service;

        public LocationController(ILocationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllLocationAsync([FromUri] LocationFilter locationFilter = null)
        {
            try
            {
                List<Location> locations = await _service.GetAllAsync(locationFilter);
                List<LocationToReturnDto> locationToReturns = new List<LocationToReturnDto>();
                foreach (Location location in locations)
                {
                    locationToReturns.Add(new LocationToReturnDto(location.Name, location.Address, location.CountryId));
                }
                return Request.CreateResponse(HttpStatusCode.OK, locationToReturns);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpGet]
        [Route("api/location/{id}")]
        public async Task<HttpResponseMessage> GetLocationAsync(Guid id)
        {
            try
            {
                Location location = await _service.GetByIdAsync(id);
                if (location != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, location);
                }
                LocationToReturnDto locationToReturn = new LocationToReturnDto(location.Name, location.Address, location.CountryId);
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Location doesnt exist");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpPost]
        public async Task<HttpResponseMessage> CreateLocationAsync([FromBody] LocationToCreateAndUpdateDto locationToCreateAndUpdateDto)
        {
            try
            {
                Location mappedLocation = new Location(Guid.NewGuid(), locationToCreateAndUpdateDto.Name, locationToCreateAndUpdateDto.Address, locationToCreateAndUpdateDto.CountryId);
                Location newLocation = await _service.CreateAsync(mappedLocation);
                if (newLocation != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new LocationToReturnDto(newLocation.Name, newLocation.Address, newLocation.CountryId));
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
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
                Location updatedLocation = await _service.UpdateAsync(id, locationInDatabase);
                if (updatedLocation != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new LocationToReturnDto(updatedLocation.Name, updatedLocation.Address, updatedLocation.CountryId));
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        [HttpDelete]
        [Route("api/location/{id}")]
        public async Task<HttpResponseMessage> DeleteLocationCustomer(Guid id)
        {
            try
            {
                bool isSuccess = await _service.DeleteAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Location delete");
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

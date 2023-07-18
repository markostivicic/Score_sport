using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service;
using ResultApp.WebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using HttpDeleteAttribute = System.Web.Http.HttpDeleteAttribute;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;
using HttpPutAttribute = System.Web.Http.HttpPutAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;

namespace ResultApp.WebApi.Controllers
{
    public class SportController : ApiController
    {
        private ISportService _service;

        public SportController(ISportService service)
        {
            _service = service;
        }
        // GET: api/Sport
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllSportAsync([FromUri] SportFilter sportFilter = null)
        {
            try
            {
                List<Sport> sports = await _service.GetAllAsync(sportFilter);
                List<SportToReturnDto> sportToReturns = new List<SportToReturnDto>();
                foreach (Sport sport in sports)
                {
                    sportToReturns.Add(new SportToReturnDto(sport.Name));
                }
                return Request.CreateResponse(HttpStatusCode.OK, sportToReturns);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpGet]
        [Route("api/sport/{id}")]
        public async Task<HttpResponseMessage> GetSportAsync(Guid id)
        {
            try
            {
                Sport sport = await _service.GetByIdAsync(id);
                if (sport == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Sport doesnt exist");
                }
                SportToReturnDto sportToReturn = new SportToReturnDto(sport.Name);
                return Request.CreateResponse(HttpStatusCode.OK, sportToReturn);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [HttpPost]
        public async Task<HttpResponseMessage> CreateSportAsync([FromBody] SportToCreateAndUpdateDto sportToCreateAndUpdateDto)
        {
            try
            {
                Sport mappedSport = new Sport(Guid.NewGuid(), sportToCreateAndUpdateDto.Name);
                Sport newSport = await _service.CreateAsync(mappedSport);
                if (newSport != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new SportToReturnDto(newSport.Name));
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
        [HttpPut]
        [Route("api/sport/{id}")]
        public async Task<HttpResponseMessage> UpdateSportAsync(Guid id, [FromBody] SportToCreateAndUpdateDto sportToCreateAndUpdateDto)
        {
            try
            {
                Sport sportInDatabase = await _service.GetByIdAsync(id);
                if (sportInDatabase == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
                }
                if (sportToCreateAndUpdateDto.Name != null) sportInDatabase.Name = sportToCreateAndUpdateDto.Name;
                Sport updatedSport = await _service.UpdateAsync(id, sportInDatabase);
                if (updatedSport != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new SportToReturnDto(updatedSport.Name));
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
        [HttpDelete]
        [Route("api/sport/{id}")]
        public async Task<HttpResponseMessage> DeleteSportCustomer(Guid id)
        {
            try
            {
                bool isSuccess = await _service.DeleteAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Sport delete");
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

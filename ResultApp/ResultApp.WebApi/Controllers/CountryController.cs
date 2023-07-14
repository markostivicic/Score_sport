using Microsoft.Ajax.Utilities;
using ResultApp.Model;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models.Country;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace ResultApp.WebApi.Controllers
{
    public class CountryController : ApiController
    {
        private readonly ICountryService _countryRepository;
        public CountryController(ICountryService countryRepository)
        {
            _countryRepository = countryRepository;
        }
        // GET: api/Country
        public async Task<HttpResponseMessage> Get()
        {
            try
            {
                List<Country> countries = await _countryRepository.GetAllAsync();
                return Request.CreateResponse(HttpStatusCode.OK, countries);
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        // GET: api/Country/5
        public async Task<HttpResponseMessage> Get(Guid id)
        {
            try
            {
                Country country = await _countryRepository.GetByIdAsync(id);
                if (country != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, country);
                }
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Item doesnt exist");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
            }

        }

        // POST: api/Country
        public async Task<HttpResponseMessage> Post([FromBody] CountryToCreateAndUpdateDto country)
        {
            try
            {
                Country mappedCountry = new Country(Guid.NewGuid(), country.Name);
                Country newCountry = await _countryRepository.CreateAsync(mappedCountry);
                if (newCountry != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, newCountry);
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
            }

        }

        // PUT: api/Country/5
        public async Task<HttpResponseMessage> Put(Guid id, [FromBody] CountryToCreateAndUpdateDto country)
        {
            try
            {
                Country countryInDatabase = await _countryRepository.GetByIdAsync(id);
                if (country.Name.IsNullOrWhiteSpace() || countryInDatabase == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
                }

                Country mappedCountry = new Country(id, country.Name);
                Country updatedCountry = await _countryRepository.UpdateAsync(id, mappedCountry);
                if (updatedCountry != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, mappedCountry);
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        // DELETE: api/Country/5
        public async Task<HttpResponseMessage> Delete(Guid id)
        {
            try
            {
                bool isSuccess = await _countryRepository.DeleteAsync(id);
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

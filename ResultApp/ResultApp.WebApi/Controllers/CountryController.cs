using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
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
    [Authorize(Roles ="User")]
    public class CountryController : ApiController
    {
        private static IEnumerable<CountryToReturnDto> MapCountryToCountryToReturn(List<Country> countries)
        {
            return countries.Select(country => new CountryToReturnDto(country.Id,country.Name));
        }
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
                return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(countries));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
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
                    return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(new List<Country> { country}).First());
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
                Country mappedCountry = new Country(Guid.NewGuid(), country.Name, User.Identity.GetUserId());
                Country newCountry = await _countryRepository.CreateAsync(mappedCountry);
                if (newCountry != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(new List<Country>{ newCountry }).First());
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

                Country mappedCountry = new Country(id, country.Name, User.Identity.GetUserId(), DateTime.Now);
                Country updatedCountry = await _countryRepository.UpdateAsync(id, mappedCountry);
                if (updatedCountry != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(new List<Country> { updatedCountry }).First());
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, "Something went wrong");
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

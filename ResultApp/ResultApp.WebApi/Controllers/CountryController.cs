using Autofac.Core;
using Microsoft.Ajax.Utilities;
using Microsoft.AspNet.Identity;
using ResultApp.Common;
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
        private static List<CountryToReturnDto> MapCountryToCountryToReturn(List<Country> countries)
        {
            return countries.Select(country => new CountryToReturnDto(country.Id, country.Name)).ToList();
        }
        private readonly ICountryService _countryService;
        public CountryController(ICountryService countryService)
        {
            _countryService = countryService;
        }

        [Authorize(Roles = "User,Admin")]
        public async Task<HttpResponseMessage> GetAllAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] CountryFilter countryFilter)
        {
            try
            {
                PageList<Country> countries = await _countryService.GetAllAsync(sorting, paging, countryFilter);
                return Request.CreateResponse(HttpStatusCode.OK, new PageList<CountryToReturnDto>(MapCountryToCountryToReturn(countries.Items), countries.TotalCount));
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }

        [Authorize(Roles = "User,Admin")]
        public async Task<HttpResponseMessage> GetByIdAsync(Guid id)
        {
            try
            {
                Country country = await _countryService.GetByIdAsync(id);
                if (country != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(new List<Country> { country }).First());
                }
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Item doesnt exist");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
        [Authorize(Roles = "Admin")]
        public async Task<HttpResponseMessage> PostAsync([FromBody] CountryToCreateAndUpdateDto country)
        {
            try
            {
                Country mappedCountry = new Country(Guid.NewGuid(), country.Name, User.Identity.GetUserId());
                Country newCountry = await _countryService.CreateAsync(mappedCountry);
                if (newCountry != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(new List<Country> { newCountry }).First());
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }

        }
        [Authorize(Roles = "Admin")]
        public async Task<HttpResponseMessage> PutAsync(Guid id, [FromBody] CountryToCreateAndUpdateDto country)
        {
            try
            {
                Country countryInDatabase = await _countryService.GetByIdAsync(id);
                if (country.Name.IsNullOrWhiteSpace() || countryInDatabase == null)
                {
                    return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
                }

                Country mappedCountry = new Country(id, country.Name, User.Identity.GetUserId(), DateTime.Now);
                Country updatedCountry = await _countryService.UpdateAsync(id, mappedCountry);
                if (updatedCountry != null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, MapCountryToCountryToReturn(new List<Country> { updatedCountry }).First());
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
        [Route("api/country/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await _countryService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Country status changed");
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

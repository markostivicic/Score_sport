using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class CountryService : ICountryService
    {
        private readonly ICountryRepository _countryRepository;
        public CountryService(ICountryRepository countryRepository)
        {
            _countryRepository = countryRepository;
        }
        public async Task<PageList<Country>> GetAllAsync(Sorting sorting, Paging paging, CountryFilter countryFilter)
        {
            return await _countryRepository.GetAllAsync(sorting, paging, countryFilter);
        }

        public async Task<Country> GetByIdAsync(Guid id)
        {
            return await _countryRepository.GetByIdAsync(id);
        }

        public async Task<Country> CreateAsync(Country country)
        {
            return await _countryRepository.CreateAsync(country);
        }

        public async Task<Country> UpdateAsync(Guid id, Country country)
        {
            return await _countryRepository.UpdateAsync(id, country);
        }

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            return await _countryRepository.ToggleActivateAsync(id);
        }
    }
}

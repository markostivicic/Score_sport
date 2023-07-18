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
        public async Task<List<Country>> GetAllAsync()
        {
            return await _countryRepository.GetAllAsync();
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

        public async Task<bool> DeleteAsync(Guid id)
        {
            return await _countryRepository.DeleteAsync(id);
        }
    }
}

using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Repository.Common
{
    public interface ICountryRepository
    {
        Task<Country> CreateAsync(Country product);
        Task<bool> ToggleActivateAsync(Guid id);
        Task<PageList<Country>> GetAllAsync(Sorting sorting, Paging paging, CountryFilter countryFilter);
        Task<Country> GetByIdAsync(Guid id);
        Task<Country> UpdateAsync(Guid id, Country country);
    }
}
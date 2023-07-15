using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Service.Common
{
    public interface ICountryService
    {
        Task<Country> CreateAsync(Country product);
        Task<bool> DeleteAsync(Guid id);
        Task<List<Country>> GetAllAsync();
        Task<Country> GetByIdAsync(Guid id);
        Task<Country> UpdateAsync(Guid id, Country product);
    }
}
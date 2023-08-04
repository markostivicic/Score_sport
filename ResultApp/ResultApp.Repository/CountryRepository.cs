using Npgsql;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public class CountryRepository : ICountryRepository
    {
        private string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);

        public async Task<PageList<Country>> GetAllAsync(Sorting sorting, Paging paging, CountryFilter countryFilter)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand();
            command.Connection = connection;
            StringBuilder sb = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"Country\" WHERE \"IsActive\" = @IsActive");
            command.Parameters.AddWithValue("@IsActive", countryFilter.IsActive);

            if (!string.IsNullOrEmpty(countryFilter.Name))
            {
                sb.Append(" AND LOWER(\"Name\") LIKE @Name");
                command.Parameters.AddWithValue("@Name", "%" + countryFilter.Name.ToLower() + "%");
            }

            string orderBy = sorting.OrderBy ?? "\"Country\".\"Id\"";
            sb.Append($" ORDER BY {orderBy} {sorting.SortOrder}");
            sb.Append(" LIMIT @pageSize OFFSET @offset");
            command.Parameters.AddWithValue("@pageSize", paging.PageSize);
            command.Parameters.AddWithValue("@offset", paging.PageNumber == 0 ? 0 : (paging.PageNumber - 1) * paging.PageSize);
            command.CommandText = sb.ToString();

            List<Country> countries = new List<Country>();
            int totalCount = 0;
            using (connection)
            {
                connection.Open();
                var reader = await command.ExecuteReaderAsync();
                while (reader.Read() && reader.HasRows)
                {
                    Country product = new Country(
                        (Guid)reader["Id"],
                        (string)reader["Name"]
                        );
                    countries.Add(product);
                    totalCount = Convert.ToInt32(reader["TotalCount"]);
                }
            }
            return new PageList<Country>(countries, totalCount);
        }

        public async Task<Country> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Country\" WHERE \"Id\"= @id AND \"IsActive\" = TRUE ", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();

                if (reader.Read())
                {
                    Country country = new Country(
                        (Guid)reader["Id"],
                        (string)reader["Name"]
                        );
                    return country;
                }
                return null;
            }
        }

        public async Task<Country> CreateAsync(Country country)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Country\" (\"Id\", \"Name\", \"CreatedByUserId\") VALUES (@id, @name, @createdbyuserid)", connection);
            using (connection)
            {
                connection.Open();
                Guid newId = Guid.NewGuid();
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@name", country.Name);
                command.Parameters.AddWithValue("@createdbyuserid", country.CreatedByUserId);
                int affected = await command.ExecuteNonQueryAsync();

                if (affected > 0)
                {
                    Country newCountry = new Country(
                        newId,
                        country.Name
                        );
                    return newCountry;

                }
                return null;
            }
        }

        public async Task<Country> UpdateAsync(Guid id, Country country)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Country\" SET \"Name\" = @name, \"UpdatedByUserId\" = @userId, \"DateUpdated\" = @date  WHERE \"Id\" = @id", connection);

            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", country.Name);
                command.Parameters.AddWithValue("@userId", country.UpdatedByUserId);
                command.Parameters.AddWithValue("@date", DateTime.Now);
                int affected = await command.ExecuteNonQueryAsync();

                if (affected > 0)
                {
                    return country;

                }
                return null;
            }
        }

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Country\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    return true;
                }
                return false;
            }
        }
    }
}

using Npgsql;
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

        public async Task<List<Country>> GetAllAsync()
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Country\"", connection);
            List<Country> countries = new List<Country>();
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
                }
            }
            return countries;
        }

        public async Task<Country> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Country\" WHERE \"Id\"= @id ", connection);
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
            var command = new NpgsqlCommand("INSERT INTO \"Country\" (\"Id\", \"Name\") VALUES (@id, @name)", connection);
            using (connection)
            {
                connection.Open();
                Guid newId = Guid.NewGuid();
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@name", country.Name);
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
            var command = new NpgsqlCommand("UPDATE \"Country\" SET \"Name\" = @name WHERE \"Id\" = @id", connection);

            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", country.Name);
                int affected = await command.ExecuteNonQueryAsync();

                if (affected > 0)
                {
                    return country;

                }
                return null;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("DELETE FROM \"Country\" WHERE \"Id\" = @id ", connection);
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

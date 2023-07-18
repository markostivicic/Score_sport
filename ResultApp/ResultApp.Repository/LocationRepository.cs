using Npgsql;
using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<List<Location>> GetAllAsync(LocationFilter locationFilter)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand();
            command.Connection = connection;
            StringBuilder sb = new StringBuilder("SELECT * FROM \"Location\" WHERE \"IsActive\" = @IsActive");
            if (locationFilter.CountryId != null)
            {
                sb.Append(" AND \"CountryId\" = @CountryId");
                command.Parameters.AddWithValue("@CountryId", locationFilter.CountryId);
            }
            if (!string.IsNullOrEmpty(locationFilter.Name))
            {
                sb.Append(" AND \"Name\" LIKE @Name");
                command.Parameters.AddWithValue("@Name", "%" + locationFilter.Name + "%");
            }
            if (!string.IsNullOrEmpty(locationFilter.Address))
            {
                sb.Append(" AND \"Address\" LIKE @Address");
                command.Parameters.AddWithValue("@Address", "%" + locationFilter.Address + "%");
            }


            command.CommandText = sb.ToString();
            List<Location> locations = new List<Location>();
            using (connection)
            {
                connection.Open();
                
                
                command.Parameters.AddWithValue("@IsActive", locationFilter.IsActive);
                var reader = await command.ExecuteReaderAsync();
                while (reader.Read() && reader.HasRows)
                {
                    Location location = new Location(
                        (Guid)reader["Id"],
                        (string)reader["Name"],
                        (string)reader["Address"],
                        (Guid)reader["CountryId"]
                        );

                    locations.Add(location);

                }
            }
            return locations;
        }
        public async Task<Location> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Location\" WHERE \"Id\"= @id ", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();
                if (reader.Read())
                {
                    Location location = new Location(
                        (Guid)reader["Id"],
                        (string)reader["Name"],
                        (string)reader["Address"],
                        (Guid)reader["CountryId"]
                        );

                    return location;
                }
                return null;
            }
        }
        public async Task<Location> CreateAsync(Location location)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Location\" (\"Id\", \"Name\", \"Address\") VALUES (@id, @name, @address)", connection);
            using (connection)
            {
                connection.Open();
                Guid newId = Guid.NewGuid();
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@name", location.Name);
                command.Parameters.AddWithValue("@address", location.Address);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    Location newLocation = new Location(
                        newId,
                        location.Name,
                        location.Address,
                        location.CountryId
                        );
                    return newLocation;
                }
                return null;
            }
        }
        public async Task<Location> UpdateAsync(Guid id, Location location)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Location\" SET \"Name\" = @name, \"Address\" = @address WHERE \"Id\" = @id", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", location.Name);
                command.Parameters.AddWithValue("@address", location.Address);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    return location;
                }
                return null;
            }
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Location\" SET \"IsActive\" = false WHERE \"Id\"=@Id", connection);
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

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
        public async Task<PageList<Location>> GetAllAsync(Sorting sorting, Paging paging, LocationFilter locationFilter)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand();
            command.Connection = connection;
            StringBuilder sb = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"Location\" INNER JOIN \"Country\" ON \"Location\".\"CountryId\" = \"Country\".\"Id\"  WHERE \"Location\".\"IsActive\" = @IsActive");

            command.Parameters.AddWithValue("@IsActive", locationFilter.IsActive);
            
            if (locationFilter.CountryId != null)
            {
                sb.Append(" AND \"CountryId\" = @CountryId");
                command.Parameters.AddWithValue("@CountryId", locationFilter.CountryId);
            }
            if (!string.IsNullOrEmpty(locationFilter.Name) && string.IsNullOrEmpty(locationFilter.Address))
            {
                sb.Append(" AND LOWER(\"Location\".\"Name\") LIKE @Name");
                command.Parameters.AddWithValue("@Name", "%" + locationFilter.Name.ToLower() + "%");
            }
            if (!string.IsNullOrEmpty(locationFilter.Address) && string.IsNullOrEmpty(locationFilter.Name))
            {
                sb.Append(" AND LOWER(\"Location\".\"Address\") LIKE @Address");
                command.Parameters.AddWithValue("@Address", "%" + locationFilter.Address.ToLower() + "%");
            }
            if(!string.IsNullOrEmpty(locationFilter.Address) && !string.IsNullOrEmpty(locationFilter.Name))
            {
                sb.Append(" AND (LOWER(\"Location\".\"Name\") LIKE @Name OR LOWER(\"Location\".\"Address\") LIKE @Address )");
                command.Parameters.AddWithValue("@Name", "%" + locationFilter.Name.ToLower() + "%");
                command.Parameters.AddWithValue("@Address", "%" + locationFilter.Address.ToLower() + "%");
            }

            string orderBy = sorting.OrderBy ?? "\"Location\".\"Id\"";
            sb.Append($" ORDER BY {orderBy} {sorting.SortOrder}");
            sb.Append(" LIMIT @pageSize OFFSET @offset");
            command.CommandText = sb.ToString();
            List<Location> locations = new List<Location>();
            int totalCount = 0;
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@pageSize", paging.PageSize);
                command.Parameters.AddWithValue("@offset", paging.PageNumber == 0 ? 0 : (paging.PageNumber - 1) * paging.PageSize);
                var reader = await command.ExecuteReaderAsync();
                while (reader.Read() && reader.HasRows)
                {
                    Country country = new Country((Guid)reader["CountryId"], (string)reader[10]);
                    Location location = new Location(
                        (Guid)reader["Id"],
                        (string)reader["Name"],
                        (string)reader["Address"],
                        (Guid)reader["CountryId"],
                        country
                        );

                    locations.Add(location);
                    totalCount = Convert.ToInt32(reader["TotalCount"]);

                }
            }
            return new PageList<Location>(locations, totalCount);
        }
        public async Task<Location> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Location\" INNER JOIN \"Country\" ON \"Location\".\"CountryId\" = \"Country\".\"Id\" WHERE \"Location\".\"Id\"= @id AND \"Location\".\"IsActive\" = true", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();
                if (reader.Read())
                {
                    Country country = new Country((Guid)reader["CountryId"], (string)reader[10]);
                    Location location = new Location(
                        (Guid)reader["Id"],
                        (string)reader["Name"],
                        (string)reader["Address"],
                        (Guid)reader["CountryId"],
                        country
                        );

                    return location;
                }
                return null;
            }
        }
        public async Task<Location> CreateAsync(Location location)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Location\" (\"Id\", \"Name\", \"Address\", \"CountryId\", \"CreatedByUserId\") VALUES (@id, @name, @address, @countryId, @user)", connection);
            using (connection)
            {
                connection.Open();
                Guid newId = Guid.NewGuid();
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@name", location.Name);
                command.Parameters.AddWithValue("@address", location.Address);
                command.Parameters.AddWithValue("@countryId", location.CountryId);
                command.Parameters.AddWithValue("@user", location.CreatedByUserId);
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
            var command = new NpgsqlCommand("UPDATE \"Location\" SET \"Name\" = @name, \"Address\" = @address, \"CountryId\" = @countryId, \"UpdatedByUserId\" = @user, \"DateUpdated\" = @date WHERE \"Id\" = @id", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@name", location.Name);
                command.Parameters.AddWithValue("@address", location.Address);
                command.Parameters.AddWithValue("@countryId", location.CountryId);
                command.Parameters.AddWithValue("@user", location.UpdatedByUserId);
                command.Parameters.AddWithValue("@date", location.DateUpdated);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    return location;
                }
                return null;
            }
        }
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Location\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

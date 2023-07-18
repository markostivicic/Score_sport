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
        public async Task<PageList<Location>> GetAllAsync(Sorting sorting, Paging paging = null, LocationFilter locationFilter = null)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand();
            command.Connection = connection;
            StringBuilder sb = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"Location\" WHERE 1=1");
            if (locationFilter.IsActive != null)
            {
                sb.Append(" AND \"IsActive\" = @IsActive");
                command.Parameters.AddWithValue("@IsActive", locationFilter.IsActive);
            }
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

            if (paging == null)
            {
                paging = new Paging()
                {
                    PageNumber = 1,
                    PageSize = 10
                };
            }
            if (paging.PageSize == 0)
            {
                paging.PageSize = 10;
            }
            if (paging.PageNumber == 0)
            {
                paging.PageNumber = 1;
            }
            if (string.IsNullOrWhiteSpace(sorting.OrderBy))
            {
                sorting.OrderBy = "ASC";
            }
            if (string.IsNullOrWhiteSpace(sorting.SortOrder))
            {
                sorting.SortOrder = "Id";
            }
            sb.Append($" ORDER BY \"{sorting.OrderBy}\" {sorting.SortOrder}");
            sb.Append(" LIMIT @pageSize OFFSET @offset");
            command.CommandText = sb.ToString();
            List<Location> locations = new List<Location>();
            int totalCount = 0;
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@pageSize", paging.PageSize);
                command.Parameters.AddWithValue("@offset", (paging.PageNumber - 1) * paging.PageSize);
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
                    totalCount = Convert.ToInt32(reader["TotalCount"]);

                }
            }
            return new PageList<Location>(locations, totalCount);
        }
        public async Task<Location> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Location\" WHERE \"Id\"= @id AND \"IsActive\" = true", connection);
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

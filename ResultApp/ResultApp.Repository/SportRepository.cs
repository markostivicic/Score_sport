using Npgsql;
using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public class SportRepository : ISportRepository
    {

        private string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<PageList<Sport>> GetAllAsync(Sorting sorting, Paging paging,SportFilter sportFilter)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand();
            command.Connection = connection;
            StringBuilder sb = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"Sport\" WHERE \"IsActive\" = @IsActive");
            command.Parameters.AddWithValue("@IsActive", sportFilter.IsActive);

            if (!string.IsNullOrEmpty(sportFilter.Name))
            {
                sb.Append(" AND LOWER(\"Name\") LIKE @Name");
                command.Parameters.AddWithValue("@Name", "%" + sportFilter.Name.ToLower() + "%");
            }

            string orderBy = sorting.OrderBy ?? "\"Sport\".\"Id\"";
            sb.Append($" ORDER BY {orderBy} {sorting.SortOrder}");
            sb.Append(" LIMIT @pageSize OFFSET @offset");
            command.CommandText = sb.ToString();
            List<Sport> sports = new List<Sport>();
            int totalCount = 0;

            using (connection)
            {
                connection.Open();
                
                command.Parameters.AddWithValue("@pageSize", paging.PageSize);
                command.Parameters.AddWithValue("@offset", paging.PageNumber == 0 ? 0 : (paging.PageNumber - 1) * paging.PageSize);

                using (var reader = await command.ExecuteReaderAsync())
                {

                    while (await reader.ReadAsync() && reader.HasRows)
                    {
                        Sport sport = new Sport(
                            (Guid)reader["Id"],
                            (string)reader["Name"]
                        );
                        sports.Add(sport);
                        totalCount = Convert.ToInt32(reader["TotalCount"]);
                    }
                }
            }

            return new PageList<Sport>(sports, totalCount);
        }
        public async Task<Sport> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Sport\" WHERE \"Id\"= @id AND \"IsActive\" = true ", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();
                if (reader.Read())
                {
                    Sport sport = new Sport(
                        (Guid)reader["Id"],
                        (string)reader["Name"]);

                    return sport;
                }
                return null;
            }
        }
        public async Task<Sport> CreateAsync(Sport sport)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Sport\" (\"Id\", \"Name\", \"CreatedByUserId\") VALUES (@id, @name, @user)", connection);
            using (connection)
            {
                connection.Open();
                Guid newId = Guid.NewGuid();
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@name", sport.Name);
                command.Parameters.AddWithValue("@user", sport.CreatedByUserId);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    Sport newSport = new Sport(
                        newId,
                        sport.Name
                        );
                    return newSport;
                }
                return null;
            }
        }
        public async Task<Sport> UpdateAsync(Guid id, Sport sport)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Sport\" SET \"Name\" = @sport, \"UpdatedByUserId\" = @user, \"DateUpdated\" = @date WHERE \"Id\" = @id", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@sport", sport.Name);
                command.Parameters.AddWithValue("@user", sport.UpdatedByUserId);
                command.Parameters.AddWithValue("@date", sport.DateUpdated);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    return sport;
                }
                return null;
            }
        }
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Sport\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

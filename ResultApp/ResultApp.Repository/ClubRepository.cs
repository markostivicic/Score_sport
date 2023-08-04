using System;
using System.Collections.Generic;
using ResultApp.Model;
using System.Text;
using System.Threading.Tasks;
using ResultApp.Repository.Common;
using Npgsql;
using ResultApp.Common;

namespace ResultApp.Repository
{
    public class ClubRepository : IClubRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<PageList<Club>> GetAllAsync(Sorting sorting, Paging paging, ClubFilter clubFilter)
        {
            int totalCount = 0;
            List<Club> clubs = new List<Club>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() AS TotalCount FROM \"Club\" INNER JOIN \"League\" on \"LeagueId\" = \"League\".\"Id\" INNER JOIN \"Location\" on \"LocationId\" = \"Location\".\"Id\" WHERE \"Club\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", clubFilter.IsActive);

            if (clubFilter.SportId != null)
            {
                queryBuilder.Append("AND \"SportId\" = @SportId ");
                command.Parameters.AddWithValue("@SportId", clubFilter.SportId);
            }
            if(clubFilter.LeagueId != null)
            {
                queryBuilder.Append("AND \"LeagueId\" = @LeagueId ");
                command.Parameters.AddWithValue("@LeagueId", clubFilter.LeagueId);
            }
            if (!string.IsNullOrEmpty(clubFilter.Name))
            {
                queryBuilder.Append("AND LOWER(\"Club\".\"Name\") LIKE @Name ");
                command.Parameters.AddWithValue("@Name", "%" + clubFilter.Name.ToLower() + "%");
            }

            string orderBy = sorting.OrderBy ?? "\"Club\".\"Id\"";
            queryBuilder.Append($"ORDER BY {orderBy} {sorting.SortOrder}");
            queryBuilder.Append(" LIMIT @PageSize OFFSET @Offset");
            command.Parameters.AddWithValue("@PageSize", paging.PageSize);
            command.Parameters.AddWithValue("@Offset", paging.PageNumber == 0 ? 0 : (paging.PageNumber - 1) * paging.PageSize);

            command.CommandText = queryBuilder.ToString();

            using (connection)
            {
                try
                {
                    connection.Open();

                    NpgsqlDataReader reader = await command.ExecuteReaderAsync();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            Guid id = (Guid)reader[0];
                            string name = (string)reader[1];
                            string logo = (string)reader[2];
                            Guid leagueId = (Guid)reader["LeagueId"];
                            string leagueName = (string)reader[11];
                            Guid sportId = (Guid)reader["SportId"];
                            Guid leagueCountryId = (Guid)reader[13];
                            Guid locationId = (Guid)reader["LocationId"];
                            string locationName = (string)reader[20];
                            string address = (string)reader["Address"];
                            Guid locationCountryId = (Guid)reader[22];
                            clubs.Add(new Club(id, name, logo, leagueId, locationId, new League(leagueId, leagueName, sportId, leagueCountryId), new Location(locationId, locationName, address, locationCountryId)));
                            totalCount = reader.GetInt32(reader.GetOrdinal("TotalCount"));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return new PageList<Club>(clubs, totalCount);
        }

        public async Task<Club> GetByIdAsync(Guid id)
        {
            Club club = await GetClubByIdAsync(id);
            return club;
        }

        public async Task<int> InsertAsync(Club club)
        {
            int affectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "INSERT INTO \"Club\" (\"Id\", \"Name\", \"Logo\", \"LeagueId\", \"LocationId\", \"CreatedByUserId\") VALUES (@Id, @Name, @Logo, @LeagueId, @LocationId, @CreatedByUserId)";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", club.Id);
            command.Parameters.AddWithValue("@Name", club.Name);
            command.Parameters.AddWithValue("@Logo", club.Logo);
            command.Parameters.AddWithValue("@LeagueId", club.LeagueId);
            command.Parameters.AddWithValue("@LocationId", club.LocationId);
            command.Parameters.AddWithValue("@CreatedByUserId", club.CreatedByUserId);

            using (connection)
            {
                try
                {
                    connection.Open();

                    affectedRows = await command.ExecuteNonQueryAsync();
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return affectedRows;
        }
        public async Task<int> UpdateAsync(Guid id, Club club)
        {
            int affectedRows = 0;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            command.CommandText = "UPDATE \"Club\" SET \"Name\" = @Name, \"Logo\" = @Logo, \"LeagueId\" = @LeagueId, \"UpdatedByUserId\" = @UpdatedByUserId, \"DateUpdated\" = @DateUpdated, \"LocationId\" = @LocationId WHERE \"Id\" = @Id";

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@Name", club.Name);
            command.Parameters.AddWithValue("@Logo", club.Logo);
            command.Parameters.AddWithValue("@LeagueId", club.LeagueId);
            command.Parameters.AddWithValue("@LocationId", club.LocationId);
            command.Parameters.AddWithValue("@UpdatedByUserId", club.UpdatedByUserId);
            command.Parameters.AddWithValue("@DateUpdated", club.DateUpdated);

            using (connection)
            {
                try
                    {
                    connection.Open();

                    affectedRows = await command.ExecuteNonQueryAsync();
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return affectedRows;
        }
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Club\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

        private async Task<Club> GetClubByIdAsync(Guid id)
        {
            Club club = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"Club\" INNER JOIN \"League\" on \"LeagueId\" = \"League\".\"Id\" INNER JOIN \"Location\" on \"LocationId\" = \"Location\".\"Id\" WHERE \"Club\".\"IsActive\" = true AND \"Club\".\"Id\" = @Id ";
            command.Parameters.AddWithValue("@Id", id);
            command.Connection = connection;

            using (connection)
            {
                try
                {
                    connection.Open();

                    NpgsqlDataReader reader = await command.ExecuteReaderAsync();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            string name = (string)reader[1];
                            string logo = (string)reader[2];
                            Guid leagueId = (Guid)reader["LeagueId"];
                            string leagueName = (string)reader[11];
                            Guid sportId = (Guid)reader["SportId"];
                            Guid leagueCountryId = (Guid)reader[13];
                            Guid locationId = (Guid)reader["LocationId"];
                            string locationName = (string)reader[20];
                            string address = (string)reader["Address"];
                            Guid locationCountryId = (Guid)reader[22];
                            club = new Club(id, name, logo, leagueId, locationId, new League(leagueId, leagueName, sportId, leagueCountryId), new Location(locationId, locationName, address, locationCountryId));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return club;
        }
    }
}

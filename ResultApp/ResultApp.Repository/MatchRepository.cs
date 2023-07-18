using Npgsql;
using ResultApp.Model;
using ResultApp.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using ResultApp.Common;
using System.Threading.Tasks;
using System.Text;

namespace ResultApp.Repository
{
    public class MatchRepository : IMatchRepository
    {

        private string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);

        public async Task<PageList<Match>> GetAllAsync(Sorting sorting, Paging paging, MatchFilter filter)
        {
            List<Match> matches = new List<Match>();
            int totalCount = 0;

            var connection = new NpgsqlConnection(connStr);
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() AS TotalCount FROM \"Match\" INNER JOIN \"Club\" on \"ClubHomeId\" = \"Club\".\"Id\" INNER JOIN \"League\" on \"LeagueId\" = \"League\".\"Id\" ");
            queryBuilder.Append("WHERE \"Match\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", filter.IsActive);

            if(filter.IsFinished == false)
            {
                queryBuilder.Append($"AND \"HomeScore\" IS NULL AND \"AwayScore\" IS NULL ");
            }
            else if(filter.IsFinished == true)
            {
                queryBuilder.Append($"AND \"HomeScore\" IS NOT NULL AND \"AwayScore\" IS NOT NULL ");
            }
            if (filter.ClubId != null)
            {
                queryBuilder.Append("AND \"ClubHomeId\" = @ClubId OR \"ClubAwayId\" = @ClubId ");
                command.Parameters.AddWithValue("@ClubId", filter.ClubId);
            }
            if (filter.Time != null)
            {
                queryBuilder.Append("AND CAST(\"Time\" AS DATE) = CAST(@Time AS DATE) ");
                command.Parameters.AddWithValue("@Time", filter.Time);
            }
            if (filter.LeagueId != null)
            {
                queryBuilder.Append("AND \"LeagueId\" = @LeagueId ");
                command.Parameters.AddWithValue("@LeagueId", filter.LeagueId);
            }
            if (filter.SportId != null)
            {
                queryBuilder.Append("AND \"SportId\"= @SportId ");
                command.Parameters.AddWithValue("@SportId", filter.SportId);
            }

            queryBuilder.Append($"ORDER BY \"{sorting.OrderBy}\" {sorting.SortOrder}");
            queryBuilder.Append(" LIMIT @PageSize OFFSET @Offset");
            command.Parameters.AddWithValue("@PageSize", paging.PageSize);
            command.Parameters.AddWithValue("@Offset", paging.PageNumber * paging.PageSize - paging.PageSize);

            command.CommandText = queryBuilder.ToString();

            using (connection)
            {
                connection.Open();
                var reader = await command.ExecuteReaderAsync();
                    while (reader.HasRows && reader.Read())
                    {
                        Match match = new Match(
                            (Guid)reader["Id"],
                            reader.GetFieldValue<int?>(reader.GetOrdinal("HomeScore")),
                            reader.GetFieldValue<int?>(reader.GetOrdinal("AwayScore")),
                            (DateTime)reader["Time"],
                            (Guid)reader["LocationId"],
                            (Guid)reader["ClubHomeId"],
                            (Guid)reader["ClubAwayId"]
                            );
                        matches.Add(match);
                    totalCount = reader.GetInt32(reader.GetOrdinal("TotalCount"));
                    }
                }
                   
            return new PageList<Match>(matches, totalCount);
        }

        public async Task<Match> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Match\" WHERE \"Id\"= @id AND \"IsActive\" = TRUE ", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();

                if (reader.Read())
                {
                    Match match = new Match(
                        (Guid)reader["Id"],
                        reader.GetFieldValue<int?>(reader.GetOrdinal("HomeScore")),
                        reader.GetFieldValue<int?>(reader.GetOrdinal("AwayScore")),
                        (DateTime)reader["Time"],
                        (Guid)reader["LocationId"],
                        (Guid)reader["ClubHomeId"],
                        (Guid)reader["ClubAwayId"]
                        );
                    return match;
                }
                return null;
            }
        }

        public async Task<Match> CreateAsync(Match match)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Match\" (\"Id\", \"Time\", \"LocationId\", \"ClubHomeId\", \"ClubAwayId\", \"CreatedByUserId\")" +
                " VALUES (@id, @time, @locationId, @clubHomeId, @clubAwayId, @createdByUserId)", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", match.Id);
                command.Parameters.AddWithValue("@time", match.Time);
                command.Parameters.AddWithValue("@locationId", match.LocationId);
                command.Parameters.AddWithValue("@clubHomeId", match.ClubHomeId);
                command.Parameters.AddWithValue("@clubAwayId", match.ClubAwayId);
                command.Parameters.AddWithValue("@createdByUserId", match.CreatedByUserId);
                int affected = await command.ExecuteNonQueryAsync();

                if (affected > 0)
                {
                    Match newMatch = new Match(
                        match.Id,
                        match.Time,
                        match.LocationId,
                        match.ClubHomeId,
                        match.ClubAwayId
                        );
                    return newMatch;

                }
                return null;
            }
        }

        public async Task<Match> UpdateAsync(Guid id, Match match)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Match\" SET \"HomeScore\" = @homeScore, \"AwayScore\" = @awayScore, \"Time\" = @time, \"LocationId\" = @locationId, \"ClubHomeId\" = @clubHomeId," +
                " \"ClubAwayId\" = @clubAwayId, \"UpdatedByUserId\" = @userId, \"DateUpdated\" = @date  WHERE \"Id\" = @id", connection);

            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@homeScore", match.HomeScore);
                command.Parameters.AddWithValue("@awayScore", match.AwayScore);
                command.Parameters.AddWithValue("@time", match.Time);
                command.Parameters.AddWithValue("@locationId", match.LocationId);
                command.Parameters.AddWithValue("@clubHomeId", match.ClubHomeId);
                command.Parameters.AddWithValue("@clubAwayId", match.ClubAwayId);
                command.Parameters.AddWithValue("@userId", match.UpdatedByUserId);
                command.Parameters.AddWithValue("@date", match.DateUpdated);
                int affected = await command.ExecuteNonQueryAsync();

                if (affected > 0)
                {
                    return match;

                }
                return null;
            }
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Match\" SET \"IsActive\" = FALSE  WHERE \"Id\" = @id ", connection);
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

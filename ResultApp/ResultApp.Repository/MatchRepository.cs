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

        public async Task<PageList<Match>> GetAllAsync(Sorting sorting, Paging paging, MatchFilter matchFilter)
        {
            List<Match> matches = new List<Match>();
            int totalCount = 0;

            var connection = new NpgsqlConnection(connStr);
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() AS TotalCount FROM \"Match\" INNER JOIN \"Location\" on \"LocationId\" = \"Location\".\"Id\" INNER JOIN \"Club\" clubHome on \"ClubHomeId\" = clubHome.\"Id\" INNER JOIN \"Club\" clubAway on \"ClubAwayId\" = clubAway.\"Id\" INNER JOIN \"League\" on clubAway.\"LeagueId\" = \"League\".\"Id\" ");
            queryBuilder.Append("WHERE \"Match\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", matchFilter.IsActive);

            if(matchFilter.IsFinished != null && matchFilter.IsFinished == false)
            {
                queryBuilder.Append($"AND \"HomeScore\" IS NULL AND \"AwayScore\" IS NULL ");
            }
            else if(matchFilter.IsFinished != null && matchFilter.IsFinished == true)
            {
                queryBuilder.Append($"AND \"HomeScore\" IS NOT NULL AND \"AwayScore\" IS NOT NULL ");
            }
            if (matchFilter.ClubId != null)
            {
                queryBuilder.Append("AND (\"ClubHomeId\" = @ClubId OR \"ClubAwayId\" = @ClubId ) ");
                command.Parameters.AddWithValue("@ClubId", matchFilter.ClubId);
            }
            if (matchFilter.Time != null)
            {
                queryBuilder.Append("AND CAST(\"Time\" AS DATE) = CAST(@Time AS DATE) ");
                command.Parameters.AddWithValue("@Time", matchFilter.Time);
            }
            if (matchFilter.LeagueId != null)
            {
                queryBuilder.Append("AND clubHome.\"LeagueId\" = @LeagueId ");
                command.Parameters.AddWithValue("@LeagueId", matchFilter.LeagueId);
            }
            if (matchFilter.SportId != null)
            {
                queryBuilder.Append("AND \"SportId\"= @SportId ");
                command.Parameters.AddWithValue("@SportId", matchFilter.SportId);
            }

            string orderBy = sorting.OrderBy ?? "\"Match\".\"Id\"";
            queryBuilder.Append($"ORDER BY {orderBy} {sorting.SortOrder}");
            queryBuilder.Append(" LIMIT @PageSize OFFSET @Offset");
            command.Parameters.AddWithValue("@PageSize", paging.PageSize);
            command.Parameters.AddWithValue("@Offset", paging.PageNumber == 0 ? 0 : (paging.PageNumber - 1) * paging.PageSize);

            command.CommandText = queryBuilder.ToString();

            using (connection)
            {
                connection.Open();
                var reader = await command.ExecuteReaderAsync();
                    while (reader.HasRows && reader.Read())
                    {
                        Match match = new Match(
                            (Guid)reader[0],
                            reader.GetFieldValue<int?>(reader.GetOrdinal("HomeScore")),
                            reader.GetFieldValue<int?>(reader.GetOrdinal("AwayScore")),
                            (DateTime)reader["Time"],
                            (Guid)reader["LocationId"],
                            (Guid)reader["ClubHomeId"],
                            (Guid)reader["ClubAwayId"],
                            new Location(
                                (Guid)reader["LocationId"],
                                (string)reader[13],
                                (string)reader["Address"],
                                (Guid)reader["CountryId"]
                                ),
                            new Club(
                                (Guid)reader["ClubHomeId"],
                                (string)reader[22],
                                (string)reader[23],
                                (Guid)reader["LeagueId"],
                                (Guid)reader["LocationId"]
                                ),
                            new Club(
                                (Guid)reader["ClubAwayId"],
                                (string)reader[32],
                                (string)reader[33],
                                (Guid)reader["LeagueId"],
                                (Guid)reader["LocationId"]
                                )
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
            var command = new NpgsqlCommand("SELECT * FROM \"Match\" INNER JOIN \"Location\" on \"LocationId\" = \"Location\".\"Id\" INNER JOIN \"Club\" clubHome on \"ClubHomeId\" = clubHome.\"Id\" INNER JOIN \"Club\" clubAway on \"ClubAwayId\" = clubAway.\"Id\" INNER JOIN \"League\" on clubAway.\"LeagueId\" = \"League\".\"Id\" WHERE \"Match\".\"Id\"= @id AND \"Match\".\"IsActive\" = TRUE ", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();

                if (reader.Read())
                {
                    Match match = new Match(
                            (Guid)reader[0],
                            reader.GetFieldValue<int?>(reader.GetOrdinal("HomeScore")),
                            reader.GetFieldValue<int?>(reader.GetOrdinal("AwayScore")),
                            (DateTime)reader["Time"],
                            (Guid)reader["LocationId"],
                            (Guid)reader["ClubHomeId"],
                            (Guid)reader["ClubAwayId"],
                            new Location(
                                (Guid)reader["LocationId"],
                                (string)reader[13],
                                (string)reader["Address"],
                                (Guid)reader["CountryId"]
                                ),
                            new Club(
                                (Guid)reader["ClubHomeId"],
                                (string)reader[22],
                                (string)reader[23],
                                (Guid)reader["LeagueId"],
                                (Guid)reader["LocationId"]
                                ),
                            new Club(
                                (Guid)reader["ClubAwayId"],
                                (string)reader[32],
                                (string)reader[33],
                                (Guid)reader["LeagueId"],
                                (Guid)reader["LocationId"]
                                )
                            );
                    return match;
                }
                return null;
            }
        }

        public async Task<Match> CreateAsync(Match match)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Match\" (\"Id\", \"HomeScore\", \"AwayScore\", \"Time\", \"LocationId\", \"ClubHomeId\", \"ClubAwayId\", \"CreatedByUserId\")" +
                " VALUES (@id, @homeScore, @awayScore, @time, @locationId, @clubHomeId, @clubAwayId, @createdByUserId)", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", match.Id);
                command.Parameters.AddWithValue("@homeScore", match.HomeScore != null ? (object)match.HomeScore : DBNull.Value);
                command.Parameters.AddWithValue("@awayScore", match.AwayScore != null ? (object)match.AwayScore : DBNull.Value);
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

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Match\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

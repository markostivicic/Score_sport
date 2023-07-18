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
    public class MatchRepository : IMatchRepository
    {

        private string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);

        public async Task<List<Match>> GetAllAsync()
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Match\" WHERE \"IsActive\" = TRUE", connection);
            List<Match> matches = new List<Match>();
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
                    }
                }
                   
            return matches;
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
                        /*Convert.ToInt32(reader["HomeScore"].ToString()),
                        Convert.ToInt32(reader["AwayScore"].ToString()),*/
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
            var command = new NpgsqlCommand("UPDATE \"Match\" SET \"Time\" = @time, \"LocationId\" = @locationId, \"ClubHomeId\" = @clubHomeId," +
                " \"ClubAwayId\" = @clubAwayId, \"UpdatedByUserId\" = @userId, \"DateUpdated\" = @date  WHERE \"Id\" = @id", connection);

            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@time", match.Time);
                command.Parameters.AddWithValue("@time", match.Time);
                command.Parameters.AddWithValue("@locationId", match.LocationId);
                command.Parameters.AddWithValue("@clubHomeId", match.ClubHomeId);
                command.Parameters.AddWithValue("@clubAwayId", match.ClubAwayId);
                command.Parameters.AddWithValue("@userId", match.UpdatedByUserId);
                command.Parameters.AddWithValue("@date", DateTime.Now);
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

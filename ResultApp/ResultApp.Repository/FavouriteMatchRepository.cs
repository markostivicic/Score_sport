using Npgsql;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace ResultApp.Repository
{
    public class FavouriteMatchRepository : IFavouriteMatchRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);

        public async Task<PageList<FavouriteMatch>> GetAllFavouriteMatchsAsync(Sorting sorting, Paging paging, FavouriteMatchFilter favouriteMatchFilter, string userId)
        {
            List<FavouriteMatch> favouriteMatchs = new List<FavouriteMatch>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            int totalCount = 0;
            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"FavouriteMatch\" INNER JOIN \"Match\" ON \"FavouriteMatch\".\"MatchId\" = \"Match\".\"Id\" WHERE 1=1 ");
            if (favouriteMatchFilter.IsActive != null)
            {
                queryBuilder.Append(" AND \"FavouriteMatch\".\"IsActive\" = @IsActive ");
                command.Parameters.AddWithValue("@IsActive", favouriteMatchFilter.IsActive);
            }

            if (favouriteMatchFilter.MatchId != null)
            {
                queryBuilder.Append("AND \"MatchId\" = @MatchId ");
                command.Parameters.AddWithValue("@MatchId", favouriteMatchFilter.MatchId);
            }

            queryBuilder.Append("AND \"FavouriteMatch\".\"CreatedByUserId\" = @UserId ");
            command.Parameters.AddWithValue("@UserId", userId);

            string orderBy = sorting.OrderBy ?? "\"FavouriteMatch\".\"Id\"";
            queryBuilder.Append($"ORDER BY {orderBy} {sorting.SortOrder}");
            queryBuilder.Append(" LIMIT @pageSize OFFSET @offset");
            command.Parameters.AddWithValue("@pageSize", paging.PageSize);
            command.Parameters.AddWithValue("@offset", paging.PageNumber == 0 ? 0 : (paging.PageNumber - 1) * paging.PageSize);

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
                            Guid id = (Guid)reader["Id"];
                            Guid matchId = (Guid)reader["MatchId"];
                            string createdByUserId = (string)reader["CreatedByUserId"];
                            int? homeScore = reader.GetFieldValue<int?>(reader.GetOrdinal("HomeScore"));
                            int? awayScore = reader.GetFieldValue<int?>(reader.GetOrdinal("AwayScore"));
                            Match match = new Match((Guid)reader[7], homeScore, awayScore,(DateTime)reader[13], (Guid)reader[10], (Guid)reader[11], (Guid)reader[12]);
                            favouriteMatchs.Add(new FavouriteMatch(id, matchId, match, createdByUserId));
                            totalCount = Convert.ToInt32(reader["TotalCount"]);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return new PageList<FavouriteMatch>(favouriteMatchs, totalCount);

        }
        public async Task<int> PostFavouriteMatchAsync(FavouriteMatch favouriteMatch)
        {
            int numberOfAffectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "INSERT INTO \"FavouriteMatch\" (\"Id\", \"MatchId\", \"CreatedByUserId\") VALUES (@Id, @MatchId, @CreatedByUserId)";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", favouriteMatch.Id);
            command.Parameters.AddWithValue("@MatchId", favouriteMatch.MatchId);
            command.Parameters.AddWithValue("@CreatedByUserId", favouriteMatch.CreatedByUserId);

            using (connection)
            {
                try
                {
                    connection.Open();

                    numberOfAffectedRows = await command.ExecuteNonQueryAsync();
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return numberOfAffectedRows;
        }

        public async Task<FavouriteMatch> GetFavouriteMatchByIdAsync(Guid id)
        {
            FavouriteMatch favouriteMatch = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"FavouriteMatch\" INNER JOIN \"Match\" ON \"FavouriteMatch\".\"MatchId\" = \"Match\".\"Id\" WHERE \"FavouriteMatch\".\"IsActive\" = true AND \"FavouriteMatch\".\"Id\"=@Id ";
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
                            Guid matchId = (Guid)reader["MatchId"];
                            string createdByUserId = (string)reader["CreatedByUserId"];
                            int? homeScore = reader.GetFieldValue<int?>(reader.GetOrdinal("HomeScore"));
                            int? awayScore = reader.GetFieldValue<int?>(reader.GetOrdinal("AwayScore"));
                            Match match = new Match((Guid)reader[7], homeScore, awayScore, (DateTime)reader[13], (Guid)reader[10], (Guid)reader[11], (Guid)reader[12]);
                            favouriteMatch = new FavouriteMatch(id, matchId, match, createdByUserId);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return favouriteMatch;
        }

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"FavouriteMatch\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

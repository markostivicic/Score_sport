using Npgsql;
using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Repository
{
    public class LeagueRepository : ILeagueRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<PageList<League>> GetAllAsync(Sorting sorting, Paging paging, LeagueFilter leagueFilter)
        {
            List<League> leagues = new List<League>();
            int totalCount = 0;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);
            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"League\" INNER JOIN \"Country\" on \"CountryId\" = \"Country\".\"Id\" INNER JOIN \"Sport\" on \"SportId\" = \"Sport\".\"Id\"");

            queryBuilder.Append("WHERE \"League\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", leagueFilter.IsActive);

            if (leagueFilter.SportId != null)
            {
                queryBuilder.Append("AND \"SportId\" = @SportId ");
                command.Parameters.AddWithValue("@SportId", leagueFilter.SportId);
            }
            if (!string.IsNullOrEmpty(leagueFilter.Name))
            {
                queryBuilder.Append("AND LOWER(\"League\".\"Name\") LIKE @Name ");
                command.Parameters.AddWithValue("@Name", "%" + leagueFilter.Name.ToLower() + "%");
            }

            string orderBy = sorting.OrderBy ?? "\"League\".\"Id\"";
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
                            Guid sportId = (Guid)reader["SportId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            string countryName = (string)reader[10];
                            string sportName = (string)reader[17];
                            leagues.Add(new League(id, name, sportId, countryId, new Country(countryId, countryName), new Sport(sportId, sportName)));
                            totalCount = Convert.ToInt32(reader["TotalCount"]);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return new PageList<League>(leagues,totalCount);
        }

        public async Task<League> GetByIdAsync(Guid id)
        {
            League league = await GetLeagueByIdAsync(id);
            return league;
        }

        public async Task<int> InsertAsync(League league)
        {
            int affectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "INSERT INTO \"League\" (\"Id\", \"Name\", \"SportId\", \"CountryId\", \"CreatedByUserId\") VALUES (@Id, @Name, @SportId, @CountryId, @CreatedByUserId)";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", league.Id);
            command.Parameters.AddWithValue("@Name", league.Name);
            command.Parameters.AddWithValue("@SportId", league.SportId);
            command.Parameters.AddWithValue("@CountryId", league.CountryId);
            command.Parameters.AddWithValue("@CreatedByUserId", league.CreatedByUserId);

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
        public async Task<int> UpdateAsync(Guid id, League league)
        {
            int affectedRows = 0;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            command.CommandText = "UPDATE \"League\" SET \"Name\" = @Name, \"SportId\" = @SportId, \"CountryId\" = @CountryId, \"UpdatedByUserId\" = @UpdatedByUserId, \"DateUpdated\" = @DateUpdated WHERE \"Id\" = @Id";

            command.Parameters.AddWithValue("@Name", league.Name);
            command.Parameters.AddWithValue("@SportId", league.SportId);
            command.Parameters.AddWithValue("@CountryId", league.CountryId);
            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@UpdatedByUserId", league.UpdatedByUserId);
            command.Parameters.AddWithValue("@DateUpdated", league.DateUpdated);

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
            var command = new NpgsqlCommand("UPDATE \"League\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

        private async Task<League> GetLeagueByIdAsync(Guid id)
        {
            League league = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"League\" INNER JOIN \"Country\" on \"CountryId\" = \"Country\".\"Id\" INNER JOIN \"Sport\" on \"SportId\" = \"Sport\".\"Id\" WHERE \"League\".\"Id\"=@Id AND \"League\".\"IsActive\"= true";
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
                            Guid sportId = (Guid)reader["SportId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            string countryName = (string)reader[10];
                            string sportName = (string)reader[17];
                            league = new League(id, name, sportId, countryId, new Country(countryId, countryName), new Sport(sportId, sportName));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return league;
        }
    }
}

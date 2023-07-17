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
        public async Task<List<League>> GetAllAsync(LeagueFilter filter)
        {
            List<League> leagues = new List<League>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT * FROM \"League\" ");

            queryBuilder.Append("WHERE \"League\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", filter.IsActive);

            if (filter.SportId != null)
            {
                queryBuilder.Append("AND \"SportId\" = @SportId");
                command.Parameters.AddWithValue("@SportId", filter.SportId);
            }

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
                            string name = (string)reader["Name"];
                            Guid sportId = (Guid)reader["SportId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            leagues.Add(new League(id, name, sportId, countryId));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return leagues;
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
        public async Task<int> DeleteAsync(Guid id)
        {
            League leagueToDelete = await GetLeagueByIdAsync(id);
            if (leagueToDelete == null)
            {
                return 0;
            }

            int affectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "UPDATE \"League\" SET \"IsActive\" = false WHERE \"Id\"=@Id";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", id);

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

        private async Task<League> GetLeagueByIdAsync(Guid id)
        {
            League league = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"League\" WHERE \"Id\"=@Id AND \"IsActive\"= true";
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
                            string name = (string)reader["Name"];
                            Guid sportId = (Guid)reader["SportId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            league = new League(id, name, sportId, countryId);
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

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
        public async Task<List<Club>> GetAllAsync(ClubFilter filter)
        {
            List<Club> clubs = new List<Club>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT * FROM \"Club\" ");

            if (filter.SportId != null)
            {
                queryBuilder.Append("INNER JOIN \"League\" on \"LeagueId\" = \"League\".\"Id\" WHERE \"SportId\" = @SportId ");
                command.Parameters.AddWithValue("@SportId", filter.SportId);
            }
            if (filter.LeagueId != null && filter.SportId != null)
            {
                queryBuilder.Append("AND \"LeagueId\" = @LeagueId ");
                command.Parameters.AddWithValue("@LeagueId", filter.LeagueId);
            }
            else if(filter.LeagueId != null)
            {
                queryBuilder.Append("WHERE \"LeagueId\" = @LeagueId ");
                command.Parameters.AddWithValue("@LeagueId", filter.LeagueId);
            }
            if (filter.SportId != null || filter.LeagueId != null)
            {
                queryBuilder.Append("AND \"Club\".\"IsActive\" = @IsActive ");
                command.Parameters.AddWithValue("@IsActive", filter.IsActive);
            }
            else
            {
                queryBuilder.Append("WHERE \"Club\".\"IsActive\" = @IsActive ");
                command.Parameters.AddWithValue("@IsActive", filter.IsActive);
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
                            string logo = (string)reader["Logo"];
                            Guid leagueId = (Guid)reader["LeagueId"];
                            Guid locationId = (Guid)reader["LocationId"];
                            clubs.Add(new Club(id, name, logo, leagueId, locationId));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return clubs;
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
        public async Task<int> DeleteAsync(Guid id)
        {
            Club clubToDelete = await GetClubByIdAsync(id);
            if (clubToDelete == null)
            {
                return 0;
            }

            int affectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "UPDATE \"Club\" SET \"IsActive\" = false WHERE \"Id\"=@Id";
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

        private async Task<Club> GetClubByIdAsync(Guid id)
        {
            Club club = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"Club\" WHERE \"Id\"=@Id AND \"IsActive\"= true";
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
                            string logo = (string)reader["Logo"];
                            Guid leagueId = (Guid)reader["LeagueId"];
                            Guid locationId = (Guid)reader["LocationId"];
                            club = new Club(id, name, logo, leagueId, locationId);
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

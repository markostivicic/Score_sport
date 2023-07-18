using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResultApp.Model;
using ResultApp.Repository.Common;
using Npgsql;
using ResultApp.Common;
using System.Diagnostics.Metrics;

namespace ResultApp.Repository
{
    internal class PlayerRepository : IPlayerRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);

        public async Task<int> PostPlayerAsync(Player player)
        {
            int numberOfAffectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);
            NpgsqlCommand command = new NpgsqlCommand();

            command.CommandText = "INSERT INTO \"Player\"(\"Id\",\"FirstName\", \"LastName\", \"Image\", \"DoB\",\"ClubId\",\"CountryId\", \"CreatedByUserId\") VALUES (@Id, @FirstName, @LastName, @Image, @DoB, @ClubId, @CountryId, @CreatedByUserId)";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", player.Id);
            command.Parameters.AddWithValue("@FirstName", player.FirstName);
            command.Parameters.AddWithValue("@LastName", player.LastName);
            command.Parameters.AddWithValue("@Image", player.Image);
            command.Parameters.AddWithValue("@DoB", player.DoB);
            command.Parameters.AddWithValue("@ClubId", player.ClubId);
            command.Parameters.AddWithValue("@CountryId", player.CountryId);
            command.Parameters.AddWithValue("@CreatedByUserId", player.CreatedByUserId);

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

                return numberOfAffectedRows;

            }
        }

        public async Task<List<Player>> GetPlayersAsync(PlayerFilter filter)
        {
            List<Player> players = new List<Player>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT * FROM \"Player\" ");

            queryBuilder.Append("WHERE \"Player\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", filter.IsActive);


            if (filter.ClubId != null)
            {
                queryBuilder.Append("AND \"ClubId\" = @ClubId");
                command.Parameters.AddWithValue("@ClubId", filter.ClubId);
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
                            string firstName = (string)reader["FirstName"];
                            string lastName = (string)reader["LastName"];
                            string image = (string)reader["Image"];
                            DateTime doB = (DateTime)reader["DoB"];
                            Guid clubId = (Guid)reader["ClubId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            players.Add(new Player(id, firstName, lastName, image, doB, clubId, countryId));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return players;
        }

        public async Task<Player> GetPlayerByIdAsync(Guid id)
        {
            Player player = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"Player\" WHERE \"Id\"=@Id AND \"IsActive\"= true";
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
                            string firstName = (string)reader["FirstName"];
                            string lastName = (string)reader["LastName"];
                            string image = (string)reader["Image"];
                            DateTime doB = (DateTime)reader["DoB"];
                            Guid clubId = (Guid)reader["clubId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            player = new Player(id, firstName, lastName, image, doB, clubId, countryId);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return player;
        }

        public async Task<int> UpdatePlayerAsync(Guid id, Player player)
        {
            int numberOfAffectedRows = 0;
            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            command.CommandText = "UPDATE \"Player\" SET \"FirstName\" = @FirstName, \"LastName\" = @LastName, \"Image\" = @Image, \"DoB\"=@DoB, \"ClubId\" = @ClubId, \"CountryId\" = @CountryId, \"UpdatedByUserId\" = @userId, \"DateUpdated\" = @date WHERE \"Id\" = @Id";

            command.Parameters.AddWithValue("@FirstName", player.FirstName);
            command.Parameters.AddWithValue("@LastName", player.LastName);
            command.Parameters.AddWithValue("@Image", player.Image);
            command.Parameters.AddWithValue("@DoB", player.DoB);
            command.Parameters.AddWithValue("@ClubId", player.ClubId);
            command.Parameters.AddWithValue("@CountryId", player.CountryId);
            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@userId", player.UpdatedByUserId);
            command.Parameters.AddWithValue("@date", DateTime.Now);

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
        public async Task<int> DeletePlayerAsync(Guid id)
        {
            Player playerToDelete = await GetPlayerByIdAsync(id);
            if (playerToDelete == null)
            {
                return 0;
            }

            int numberOfAffectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "UPDATE \"Player\" SET \"IsActive\" = false WHERE \"Id\"=@Id";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", id);

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

    }
}

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

        public async Task<PageList<Player>> GetPlayersAsync(Sorting sorting, Paging paging, PlayerFilter playerFilter)
        {
            List<Player> players = new List<Player>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            int totalCount = 0;
            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"Player\" INNER JOIN \"Club\" ON \"Player\".\"ClubId\" = \"Club\".\"Id\" INNER JOIN \"Country\" ON \"Player\".\"CountryId\" = \"Country\".\"Id\" ");

            queryBuilder.Append("WHERE \"Player\".\"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", playerFilter.IsActive);


            if (playerFilter.ClubId != null)
            {
                queryBuilder.Append("AND \"ClubId\" = @ClubId ");
                command.Parameters.AddWithValue("@ClubId", playerFilter.ClubId);
            }
            if (!string.IsNullOrEmpty(playerFilter.Name))
            {
                queryBuilder.Append("AND LOWER(\"Player\".\"FirstName\") LIKE @Name OR LOWER(\"Player\".\"LastName\") LIKE @Name ");
                command.Parameters.AddWithValue("@Name", "%" + playerFilter.Name.ToLower() + "%");
            }

            string orderBy = sorting.OrderBy ?? "\"Player\".\"Id\"";
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
                            Guid id = (Guid)reader[0];
                            string firstName = (string)reader["FirstName"];
                            string lastName = (string)reader["LastName"];
                            string image = (string)reader["Image"];
                            DateTime doB = (DateTime)reader["DoB"];
                            Guid clubId = (Guid)reader["ClubId"];
                            Guid countryId = (Guid)reader["CountryId"];
                            Club club = new Club((Guid)reader[12], (string)reader[13], (string)reader[14], (Guid)reader[15], (Guid)reader[16]);
                            Country country = new Country((Guid)reader[6], (string)reader[23]);
                            players.Add(new Player(id, firstName, lastName, image, doB, clubId, countryId, club, country));
                            totalCount = Convert.ToInt32(reader["TotalCount"]);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }
            return new PageList<Player>(players, totalCount);
        }

        public async Task<Player> GetPlayerByIdAsync(Guid id)
        {
            Player player = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"Player\" INNER JOIN \"Club\" ON \"Player\".\"ClubId\" = \"Club\".\"Id\" INNER JOIN \"Country\" ON \"Player\".\"CountryId\" = \"Country\".\"Id\" WHERE \"Player\".\"Id\"=@Id AND \"Player\".\"IsActive\"= true";
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
                            Club club = new Club((Guid)reader[12], (string)reader[13], (string)reader[14], (Guid)reader[15], (Guid)reader[16]);
                            Country country = new Country((Guid)reader[6], (string)reader[23]);
                            player = new Player(id, firstName, lastName, image, doB, clubId, countryId, club, country);
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
        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Player\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

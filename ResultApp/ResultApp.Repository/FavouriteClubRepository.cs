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
    public class FavouriteClubRepository : IFavouriteClubRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);

        public async Task<List<FavouriteClub>> GetAllFavouriteClubsAsync(FavouriteClubFilter filter)
        {
            List<FavouriteClub> favouriteClubs = new List<FavouriteClub>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT * FROM \"FavouriteClub\" WHERE \"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", filter.IsActive);

            if (filter.UserId != null)
            {
                queryBuilder.Append("AND \"CreatedByUserId\" = @UserId ");
                command.Parameters.AddWithValue("@UserId", filter.UserId);
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
                            Guid clubId = (Guid)reader["ClubId"];
                            string createdByUserId = (string)reader["CreatedByUserId"];
                            favouriteClubs.Add(new FavouriteClub(id, clubId, createdByUserId));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return favouriteClubs;

        }
        public async Task<int> PostFavouriteClubAsync(FavouriteClub favouriteClub)
        {
            int numberOfAffectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "INSERT INTO \"FavouriteClub\" (\"Id\", \"ClubId\", \"CreatedByUserId\") VALUES (@Id, @ClubId, @CreatedByUserId)";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", favouriteClub.Id);
            command.Parameters.AddWithValue("@ClubId", favouriteClub.ClubId);
            command.Parameters.AddWithValue("@CreatedByUserId", favouriteClub.CreatedByUserId);

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

        public async Task<FavouriteClub> GetFavouriteClubByIdAsync(Guid id)
        {
            FavouriteClub favouriteClub = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"FavouriteClub\" WHERE \"Id\"=@Id AND \"IsActive\"= true";
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
                            Guid clubId = (Guid)reader["ClubId"];
                            string createdByUserId = (string)reader["CreatedByUserId"];
                            favouriteClub = new FavouriteClub(id, clubId, createdByUserId);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return favouriteClub;
        }

        public async Task<int> DeleteFavouriteClubAsync(Guid id)
        {
            FavouriteClub favouriteCLub = await GetFavouriteClubByIdAsync(id);
            if (favouriteCLub == null)
            {
                return 0;
            }

            int numberOfAffectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "UPDATE \"FavouriteClub\" SET \"IsActive\" = false WHERE \"Id\"=@Id";
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

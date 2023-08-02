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

        public async Task<PageList<FavouriteClub>> GetAllFavouriteClubsAsync(Sorting sorting, Paging paging, FavouriteClubFilter favouriteClubFilter, string userId)
        {
            List<FavouriteClub> favouriteClubs = new List<FavouriteClub>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            int totalCount = 0;
            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"FavouriteClub\" INNER JOIN \"Club\" ON \"FavouriteClub\".\"ClubId\" = \"Club\".\"Id\" WHERE 1=1 ");
            if(favouriteClubFilter.IsActive != null)
            {
                queryBuilder.Append(" AND \"FavouriteClub\".\"IsActive\" = @IsActive ");
                command.Parameters.AddWithValue("@IsActive", favouriteClubFilter.IsActive);
            }

            if (favouriteClubFilter.ClubId != null)
            {
                queryBuilder.Append("AND \"ClubId\" = @ClubId ");
                command.Parameters.AddWithValue("@ClubId", favouriteClubFilter.ClubId);
            }

            queryBuilder.Append("AND \"FavouriteClub\".\"CreatedByUserId\" = @UserId ");
            command.Parameters.AddWithValue("@UserId", userId);

            string orderBy = sorting.OrderBy ?? "\"FavouriteClub\".\"Id\"";
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
                            Guid clubId = (Guid)reader["ClubId"];
                            string createdByUserId = (string)reader["CreatedByUserId"];
                            Club club = new Club((Guid)reader[7], (string)reader[8], (string)reader[9], (Guid)reader[10], (Guid)reader[11]);
                            favouriteClubs.Add(new FavouriteClub(id, clubId, club, createdByUserId));
                            totalCount = Convert.ToInt32(reader["TotalCount"]);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return new PageList<FavouriteClub>(favouriteClubs, totalCount);

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
            command.CommandText = "SELECT * FROM \"FavouriteClub\" INNER JOIN \"Club\" ON \"FavouriteClub\".\"ClubId\" = \"Club\".\"Id\" WHERE \"FavouriteClub\".\"IsActive\" = true AND \"FavouriteClub\".\"Id\"=@Id ";
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
                            Club club = new Club((Guid)reader[7], (string)reader[8], (string)reader[9], (Guid)reader[10], (Guid)reader[11]);
                            favouriteClub = new FavouriteClub(id, clubId, club, createdByUserId);
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

        public async Task<bool> ToggleActivateAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"FavouriteClub\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

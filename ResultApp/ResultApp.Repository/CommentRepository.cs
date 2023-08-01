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
    public class CommentRepository : ICommentRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<PageList<Comment>> GetAllAsync(Sorting sorting, Paging paging, CommentFilter commentFilter)
        {
            List<Comment> comments = new List<Comment>();
            int totalCount = 0;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT *, COUNT(*) OVER() as TotalCount FROM \"Comment\" INNER JOIN dbo.\"AspNetUsers\" ON \"Comment\".\"CreatedByUserId\" = dbo.\"AspNetUsers\".\"Id\" WHERE \"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", commentFilter.IsActive);

            if (commentFilter.MatchId != null)
            {
                queryBuilder.Append("AND \"MatchId\" = @MatchId ");
                command.Parameters.AddWithValue("@MatchId", commentFilter.MatchId);
            }
            if (commentFilter.UserId != null)
            {
                queryBuilder.Append("AND \"CreatedByUserId\" = @UserId ");
                command.Parameters.AddWithValue("@UserId", commentFilter.UserId.ToString());
            }

            string orderBy = sorting.OrderBy ?? "\"Comment\".\"Id\"";
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
                            string text = (string)reader["Text"];
                            Guid matchId = (Guid)reader["MatchId"];
                            string userId = (string)reader["CreatedByUserId"];
                            User user = new User();
                            user.Id = userId;
                            user.UserName = (string)reader["UserName"];
                            Comment comment = new Comment(id, text, matchId, userId, user);
                            comment.DateCreated = (DateTime)reader["DateCreated"];
                            comments.Add(comment);
                            totalCount = reader.GetInt32(reader.GetOrdinal("TotalCount"));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return new PageList<Comment>(comments, totalCount);
        }

        public async Task<Comment> GetByIdAsync(Guid id)
        {
            Comment comment = await GetCommentByIdAsync(id);
            return comment;
        }

        public async Task<int> InsertAsync(Comment comment)
        {
            int affectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "INSERT INTO \"Comment\" (\"Id\", \"Text\", \"MatchId\", \"CreatedByUserId\") VALUES (@Id, @Text, @MatchId, @CreatedByUserId)";
            command.Connection = connection;
            command.Parameters.AddWithValue("@Id", comment.Id);
            command.Parameters.AddWithValue("@Text", comment.Text);
            command.Parameters.AddWithValue("@MatchId", comment.MatchId);
            command.Parameters.AddWithValue("@CreatedByUserId", Guid.Parse(comment.CreatedByUserId));

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

        public async Task<int> UpdateAsync(Guid id, Comment comment)
        {
            int affectedRows = 0;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;
            command.CommandText = "UPDATE \"Comment\" SET \"Text\" = @Text, \"MatchId\" = @MatchId, \"UpdatedByUserId\" = @UpdatedByUserId, \"DateUpdated\" = @DateUpdated WHERE \"Id\" = @Id";

            command.Parameters.AddWithValue("@Id", id);
            command.Parameters.AddWithValue("@Text", comment.Text);
            command.Parameters.AddWithValue("@MatchId", comment.MatchId);
            command.Parameters.AddWithValue("@UpdatedByUserId", comment.UpdatedByUserId);
            command.Parameters.AddWithValue("@DateUpdated", comment.DateUpdated);

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
            var command = new NpgsqlCommand("UPDATE \"Comment\" SET \"IsActive\" = NOT \"IsActive\" WHERE \"Id\"=@Id", connection);
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

        private async Task<Comment> GetCommentByIdAsync(Guid id)
        {
            Comment comment = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"Comment\" INNER JOIN dbo.\"AspNetUsers\" ON \"Comment\".\"CreatedByUserId\" = dbo.\"AspNetUsers\".\"Id\" WHERE \"Comment\".\"Id\"=@Id AND \"IsActive\"= true";
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
                            string text = (string)reader["Text"];
                            Guid matchId = (Guid)reader["MatchId"];
                            string userId = (string)reader["CreatedByUserId"];
                            User user = new User();
                            user.Id = userId;
                            user.UserName = (string)reader["UserName"];
                            comment = new Comment(id, text, matchId, userId, user);
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return comment;
        }
    }
}

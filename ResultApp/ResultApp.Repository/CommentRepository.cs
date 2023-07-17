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
    public class CommentRepository : ICommentRepository
    {
        private readonly string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<List<Comment>> GetAllAsync(CommentFilter filter)
        {
            List<Comment> comments = new List<Comment>();

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.Connection = connection;

            StringBuilder queryBuilder = new StringBuilder("SELECT * FROM \"Comment\" WHERE \"IsActive\" = @IsActive ");
            command.Parameters.AddWithValue("@IsActive", filter.IsActive);

            if (filter.MatchId != null)
            {
                queryBuilder.Append("AND \"MatchId\" = @MatchId ");
                command.Parameters.AddWithValue("@MatchId", filter.MatchId);
            }
            if (filter.UserId != null)
            {
                queryBuilder.Append("AND \"CreatedByUserId\" = @UserId ");
                command.Parameters.AddWithValue("@UserId", filter.UserId.ToString());
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
                            string text = (string)reader["Text"];
                            Guid matchId = (Guid)reader["MatchId"];
                            string userId = (string)reader["CreatedByUserId"];
                            comments.Add(new Comment(id, text, matchId, userId));
                        }
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            return comments;
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

        public async Task<int> DeleteAsync(Guid id)
        {
            Comment commentToDelete = await GetCommentByIdAsync(id);
            if (commentToDelete == null)
            {
                return 0;
            }

            int affectedRows;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "UPDATE \"Comment\" SET \"IsActive\" = false WHERE \"Id\"=@Id";
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

        private async Task<Comment> GetCommentByIdAsync(Guid id)
        {
            Comment comment = null;

            NpgsqlConnection connection = new NpgsqlConnection(connStr);

            NpgsqlCommand command = new NpgsqlCommand();
            command.CommandText = "SELECT * FROM \"Comment\" WHERE \"Id\"=@Id AND \"IsActive\"= true";
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
                            comment = new Comment(id, text, matchId, userId);
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

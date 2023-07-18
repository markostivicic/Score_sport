using Npgsql;
using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static ResultApp.Repository.SportRepository;

namespace ResultApp.Repository
{
    public class SportRepository : ISportRepository
    {

        private string connStr = Environment.GetEnvironmentVariable("connStr", EnvironmentVariableTarget.User);
        public async Task<List<Sport>> GetAllAsync(SportFilter sportFilter = null)
        {
            var connection = new NpgsqlConnection(connStr);
            StringBuilder sb = new StringBuilder("SELECT * FROM \"Sport\" WHERE \"IsActive\" = @IsActive");
            if (!string.IsNullOrEmpty(sportFilter.Name))
            {
                sb.Append(" AND \"Name\" LIKE @Name");
            }


            var command = new NpgsqlCommand(sb.ToString(), connection);
            List<Sport> sports = new List<Sport>();
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@Name", "%" + sportFilter.Name + "%");
                command.Parameters.AddWithValue("@IsActive", sportFilter.IsActive);
                var reader = await command.ExecuteReaderAsync();
                while (reader.Read() && reader.HasRows)
                {
                    Sport sport = new Sport(
                        (Guid)reader["Id"],
                        (string)reader["Name"]
                        );

                    sports.Add(sport);

                }
            }
            return sports;
        }
        public async Task<Sport> GetByIdAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("SELECT * FROM \"Sport\" WHERE \"Id\"= @id ", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                var reader = await command.ExecuteReaderAsync();
                if (reader.Read())
                {
                    Sport sport = new Sport(
                        (Guid)reader["Id"],
                        (string)reader["Name"]);

                    return sport;
                }
                return null;
            }
        }
        public async Task<Sport> CreateAsync(Sport sport)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("INSERT INTO \"Sport\" (\"Id\", \"Name\") VALUES (@id, @name)", connection);
            using (connection)
            {
                connection.Open();
                Guid newId = Guid.NewGuid();
                command.Parameters.AddWithValue("@id", newId);
                command.Parameters.AddWithValue("@name", sport.Name);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    Sport newSport = new Sport(
                        newId,
                        sport.Name
                        );
                    return newSport;
                }
                return null;
            }
        }
        public async Task<Sport> UpdateAsync(Guid id, Sport sport)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Sport\" SET \"Name\" = @sport WHERE \"Id\" = @id", connection);
            using (connection)
            {
                connection.Open();
                command.Parameters.AddWithValue("@id", id);
                command.Parameters.AddWithValue("@sport", sport.Name);
                int affected = await command.ExecuteNonQueryAsync();
                if (affected > 0)
                {
                    return sport;
                }
                return null;
            }
        }
        public async Task<bool> DeleteAsync(Guid id)
        {
            var connection = new NpgsqlConnection(connStr);
            var command = new NpgsqlCommand("UPDATE \"Sport\" SET \"IsActive\" = false WHERE \"Id\"=@Id", connection);
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

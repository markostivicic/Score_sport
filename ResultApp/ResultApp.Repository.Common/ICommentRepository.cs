using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Repository.Common
{
    public interface ICommentRepository
    {
        Task<List<Comment>> GetAllAsync(CommentFilter filter);
        Task<Comment> GetByIdAsync(Guid id);
        Task<int> InsertAsync(Comment comment);
        Task<int> UpdateAsync(Guid id, Comment comment);
        Task<int> DeleteAsync(Guid id);
    }
}

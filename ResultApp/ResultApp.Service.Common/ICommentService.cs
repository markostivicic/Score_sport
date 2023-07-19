using ResultApp.Common;
using ResultApp.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResultApp.Service.Common
{
    public interface ICommentService
    {
        Task<PageList<Comment>> GetAllAsync(Sorting sorting, Paging paging, CommentFilter commentFilter);
        Task<Comment> GetByIdAsync(Guid id);
        Task<int> InsertAsync(Comment comment);
        Task<int> UpdateAsync(Guid id, Comment comment);
        Task<bool> ToggleActivateAsync(Guid id);
    }
}

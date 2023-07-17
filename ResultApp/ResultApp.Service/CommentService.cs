using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Repository.Common;
using ResultApp.Service.Common;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ResultApp.Service
{
    public class CommentService : ICommentService
    {
        private ICommentRepository CommentRepository { get; }

        public CommentService(ICommentRepository commentRepository)
        {
            CommentRepository = commentRepository;
        }

        public async Task<List<Comment>> GetAllAsync(CommentFilter filter)
        {
            return await CommentRepository.GetAllAsync(filter);
        }
        public async Task<Comment> GetByIdAsync(Guid id)
        {
            return await CommentRepository.GetByIdAsync(id);
        }
        public async Task<int> InsertAsync(Comment comment)
        {
            return await CommentRepository.InsertAsync(comment);
        }
        public async Task<int> UpdateAsync(Guid id, Comment comment)
        {
            return await CommentRepository.UpdateAsync(id, comment);
        }
        public async Task<int> DeleteAsync(Guid id)
        {
            return await CommentRepository.DeleteAsync(id);
        }
    }
}

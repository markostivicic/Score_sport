using ResultApp.Common;
using ResultApp.Model;
using ResultApp.Service;
using ResultApp.Service.Common;
using ResultApp.WebApi.Models.Comment;
using ResultApp.WebApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;

namespace ResultApp.WebApi.Controllers
{
    public class CommentController : ApiController
    {
        private ICommentService CommentService { get; }

        public CommentController(ICommentService commentService)
        {
            CommentService = commentService;
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetAllComments(Guid? matchId = null, Guid? userId = null, bool isActive = true)
        {
            CommentFilter filter = new CommentFilter(matchId, userId, isActive);

            List<Comment> comments = await CommentService.GetAllAsync(filter);
            if (comments.Count <= 0)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No comments found.");
            }

            List<CommentToReturnDto> commentViews = new List<CommentToReturnDto>();
            foreach (var comment in comments)
            {
                commentViews.Add(new CommentToReturnDto(comment.Text, comment.MatchId, comment.CreatedByUserId, new UserToReturnDto(comment.CreatedByUserId, comment.User.UserName)));
            }
            return Request.CreateResponse(HttpStatusCode.OK, commentViews);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetCommentById(Guid id)
        {
            Comment comment = await CommentService.GetByIdAsync(id);
            if (comment == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Comment with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new CommentToReturnDto(comment.Text, comment.MatchId, comment.CreatedByUserId, new UserToReturnDto(comment.CreatedByUserId, comment.User.UserName)));
        }

        [HttpPost]
        public async Task<HttpResponseMessage> InsertComment([FromBody] CommentToCreateAndUpdateDto comment)
        {
            if (comment == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Comment is null!");
            }

            Comment commentToInsert = new Comment(Guid.NewGuid(), comment.Text, (Guid)comment.MatchId, User.Identity.GetUserId());

            int affectedRows = await CommentService.InsertAsync(commentToInsert);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Comment was inserted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Comment was not inserted!");
        }

        [HttpPut]
        public async Task<HttpResponseMessage> UpdateComment(Guid id, [FromBody] CommentToCreateAndUpdateDto comment)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }
            if (comment == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Comment is null!");
            }

            Comment commentById = await CommentService.GetByIdAsync(id);
            if (commentById == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Comment with that id was not found!");
            }
            string text = comment.Text;
            Guid? matchId = comment.MatchId;
            if (text == null)
            {
                text = commentById.Text;
            }
            if (matchId == null)
            {
                matchId = commentById.MatchId;
            }

            Comment commentToUpdate = new Comment(id, text, (Guid)matchId, User.Identity.GetUserId(), DateTime.Now);

            int affectedRows = await CommentService.UpdateAsync(id, commentToUpdate);
            if (affectedRows == 0)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Comment with that ID was not found!");
            }
            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Comment was updated. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Comment was not updated!");
        }

        [HttpDelete]
        public async Task<HttpResponseMessage> DeleteComment(Guid id)
        {
            if (id == null)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Id is null!");
            }

            int affectedRows = await CommentService.DeleteAsync(id);

            if (affectedRows > 0)
            {
                return Request.CreateResponse(HttpStatusCode.OK, $"Comment was deleted. Affected rows: {affectedRows}");
            }
            return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Comment was not deleted!");
        }
    }
}
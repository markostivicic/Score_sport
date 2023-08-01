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
using Autofac.Core;

namespace ResultApp.WebApi.Controllers
{
    public class CommentController : ApiController
    {
        private ICommentService CommentService { get; }

        public CommentController(ICommentService commentService)
        {
            CommentService = commentService;
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetAllCommentsAsync([FromUri] Sorting sorting, [FromUri] Paging paging, [FromUri] CommentFilter commentFilter)
        {
            PageList<Comment> comments = await CommentService.GetAllAsync(sorting, paging, commentFilter);
            List<CommentToReturnDto> commentViews = new List<CommentToReturnDto>();
            foreach (var comment in comments.Items)
            {
                commentViews.Add(new CommentToReturnDto(comment.Id, comment.Text, comment.MatchId, comment.CreatedByUserId, new UserToReturnDto(comment.CreatedByUserId, comment.User.UserName), comment.DateCreated));
            }
            return Request.CreateResponse(HttpStatusCode.OK, new PageList<CommentToReturnDto>(commentViews,comments.TotalCount));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<HttpResponseMessage> GetCommentByIdAsync(Guid id)
        {
            Comment comment = await CommentService.GetByIdAsync(id);
            if (comment == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound, "Comment with that ID was not found!");
            }

            return Request.CreateResponse(HttpStatusCode.OK, new CommentToReturnDto(comment.Id, comment.Text, comment.MatchId, comment.CreatedByUserId, new UserToReturnDto(comment.CreatedByUserId, comment.User.UserName), comment.DateCreated));
        }

        [Authorize(Roles = "User,Admin")]
        [HttpPost]
        public async Task<HttpResponseMessage> InsertCommentAsync([FromBody] CommentToCreateAndUpdateDto comment)
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

        [Authorize(Roles = "User,Admin")]
        [HttpPut]
        public async Task<HttpResponseMessage> UpdateCommentAsync(Guid id, [FromBody] CommentToCreateAndUpdateDto comment)
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

        [Authorize(Roles = "User,Admin")]
        [HttpDelete]
        [Route("api/comment/toggle/{id}")]
        public async Task<HttpResponseMessage> ToggleActivateAsync(Guid id)
        {
            try
            {
                bool isSuccess = await CommentService.ToggleActivateAsync(id);
                if (isSuccess)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, "Sport status changed");
                }
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Bad request");
            }
            catch (Exception ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}
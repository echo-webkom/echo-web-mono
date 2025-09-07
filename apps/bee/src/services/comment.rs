use async_trait::async_trait;

use crate::{
    models::{
        domain::{
            Comment,
            shared::{
                comment_id::CommentId, post_id::PostId, reaction_type::ReactionType,
                user_id::UserId,
            },
        },
        dto::{CommentResponse, CreateCommentRequest},
    },
    repositories::comments::CommentRepository,
};

#[async_trait]
pub trait CommentService: Send + Sync {
    /// Creates a new comment
    async fn create_comment(
        &self,
        request: CreateCommentRequest,
    ) -> anyhow::Result<CommentResponse>;

    /// Gets all comments for a post
    async fn get_comments_by_post(&self, post_id: PostId) -> anyhow::Result<Vec<CommentResponse>>;

    /// React to a comment
    async fn react_to_comment(
        &self,
        comment_id: CommentId,
        user_id: UserId,
        reaction: ReactionType,
    ) -> anyhow::Result<()>;
}

#[derive(Clone)]
pub struct CommentServiceImpl<R: CommentRepository + Send + Sync> {
    comment_repository: R,
}

impl<R: CommentRepository + Send + Sync> CommentServiceImpl<R> {
    pub fn new(comment_repository: R) -> Self {
        Self { comment_repository }
    }
}

#[async_trait]
impl<R: CommentRepository + Send + Sync> CommentService for CommentServiceImpl<R> {
    async fn create_comment(
        &self,
        request: CreateCommentRequest,
    ) -> anyhow::Result<CommentResponse> {
        let comment = Comment::from(request);

        self.comment_repository.add_comment(comment.clone()).await?;

        Ok(CommentResponse::from(comment))
    }

    async fn get_comments_by_post(&self, post_id: PostId) -> anyhow::Result<Vec<CommentResponse>> {
        let comments = self.comment_repository.get_comments(post_id).await?;

        let responses = comments.into_iter().map(CommentResponse::from).collect();

        Ok(responses)
    }

    async fn react_to_comment(
        &self,
        comment_id: CommentId,
        user_id: UserId,
        reaction: ReactionType,
    ) -> anyhow::Result<()> {
        self.comment_repository
            .add_comment_reaction(comment_id, user_id, reaction)
            .await?;

        Ok(())
    }
}

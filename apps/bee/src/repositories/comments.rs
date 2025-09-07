use async_trait::async_trait;

use crate::models::domain::{
    Comment,
    shared::{
        comment_id::CommentId, post_id::PostId, reaction_type::ReactionType, user_id::UserId,
    },
};

#[async_trait]
pub trait CommentRepository {
    /// Adds a comment to a data store.
    async fn add_comment(&self, comment: Comment) -> anyhow::Result<()>;

    /// Retrieves all comments from the data store.
    async fn get_comments(&self, post_id: PostId) -> anyhow::Result<Vec<Comment>>;

    /// Adds a reaction to a comment.
    async fn add_comment_reaction(
        &self,
        comment_id: CommentId,
        user_id: UserId,
        reaction: ReactionType,
    ) -> anyhow::Result<()>;
}

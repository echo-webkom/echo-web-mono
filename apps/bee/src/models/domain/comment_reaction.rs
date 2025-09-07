use chrono::NaiveDateTime;

use crate::models::domain::shared::reaction_type::ReactionType;

use super::shared::{comment_id::CommentId, user_id::UserId};

#[derive(Debug, Clone)]
pub struct CommentReaction {
    pub comment_id: Option<CommentId>,
    pub user_id: Option<UserId>,
    pub reaction_type: ReactionType,
    pub created_at: Option<NaiveDateTime>,
}

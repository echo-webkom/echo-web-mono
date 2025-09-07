use std::collections::HashMap;

use crate::models::domain::shared::{
    comment_id::CommentId, post_id::PostId, reaction_type::ReactionType, user_id::UserId,
};

#[derive(Clone, Debug)]
pub struct Comment {
    pub id: Option<CommentId>,
    pub post_id: Option<PostId>,
    pub parent_comment_id: Option<CommentId>,
    pub user_id: Option<UserId>,
    pub content: String,
    pub updated_at: Option<chrono::NaiveDateTime>,
    pub reactions: HashMap<ReactionType, u16>,
}

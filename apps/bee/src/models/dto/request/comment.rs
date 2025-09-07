use std::collections::HashMap;

use serde::Deserialize;

use crate::models::domain::Comment;

#[derive(Debug, Deserialize)]
pub struct CreateCommentRequest {
    pub post_id: String,
    pub parent_comment_id: Option<String>,
    pub user_id: String,
    pub content: String,
}

impl From<CreateCommentRequest> for Comment {
    fn from(req: CreateCommentRequest) -> Self {
        Comment {
            id: None,
            post_id: Some(req.post_id.into()),
            parent_comment_id: req.parent_comment_id.map(|id| id.into()),
            user_id: Some(req.user_id.into()),
            content: req.content,
            updated_at: None,
            reactions: HashMap::new(),
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateCommentReactionRequest {
    pub user_id: String,
    pub reaction_type: String,
}

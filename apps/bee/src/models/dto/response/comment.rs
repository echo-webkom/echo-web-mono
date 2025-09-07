use std::collections::HashMap;

use serde::Serialize;

use crate::models::domain::Comment;

#[derive(Debug, Serialize)]
pub struct CommentResponse {
    pub id: String,
    pub post_id: Option<String>,
    pub parent_comment_id: Option<String>,
    pub user_id: Option<String>,
    pub content: String,
    pub updated_at: String, // ISO 8601 formatted
    pub reactions: HashMap<String, u16>,
}

impl From<Comment> for CommentResponse {
    fn from(comment: Comment) -> Self {
        CommentResponse {
            id: comment
                .id
                .and_then(|id| id.value().parse().ok())
                .unwrap_or_default(),
            post_id: comment.post_id.and_then(|id| id.value().parse().ok()),
            parent_comment_id: comment
                .parent_comment_id
                .and_then(|id| id.value().parse().ok()),
            user_id: comment.user_id.and_then(|id| id.value().parse().ok()),
            content: comment.content,
            updated_at: comment
                .updated_at
                .map(|dt| dt.format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string())
                .unwrap_or_default(),
            reactions: comment
                .reactions
                .iter()
                .map(|(k, v)| (k.clone().to_string(), *v))
                .collect(),
        }
    }
}

use serde::Serialize;

use crate::models::domain::CommentReaction;

#[derive(Debug, Serialize)]
pub struct CommentReactionResponse {
    pub comment_id: String,
    pub user_id: String,
    pub reaction_type: String,
    pub created_at: String, // ISO 8601 formatted
}

impl From<CommentReaction> for CommentReactionResponse {
    fn from(reaction: CommentReaction) -> Self {
        CommentReactionResponse {
            comment_id: reaction
                .comment_id
                .map(|id| id.value().to_string())
                .unwrap_or_default(),
            user_id: reaction
                .user_id
                .map(|id| id.value().to_string())
                .unwrap_or_default(),
            reaction_type: reaction.reaction_type.to_string(),
            created_at: reaction
                .created_at
                .map(|dt| dt.format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string())
                .unwrap_or_default(),
        }
    }
}

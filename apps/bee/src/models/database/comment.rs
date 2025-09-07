use std::collections::HashMap;

use crate::models::domain::{
    Comment,
    shared::{
        comment_id::CommentId, post_id::PostId, reaction_type::ReactionType, user_id::UserId,
    },
};

#[derive(sqlx::FromRow, Debug, Clone)]
pub struct CommentRow {
    pub id: String,
    pub post_id: String,
    pub parent_comment_id: Option<String>,
    pub user_id: Option<String>,
    pub content: String,
    pub updated_at: chrono::NaiveDateTime,
}

impl From<CommentRow> for Comment {
    fn from(row: CommentRow) -> Self {
        Comment {
            id: Some(CommentId::new(row.id)),
            post_id: Some(PostId::new(row.post_id)),
            parent_comment_id: row.parent_comment_id.map(CommentId::new),
            user_id: row.user_id.map(UserId::from),
            content: row.content,
            updated_at: Some(row.updated_at),
            reactions: HashMap::new(),
        }
    }
}

#[derive(sqlx::FromRow, Debug, Clone)]
pub struct CommentWithReactionsRow {
    // Comment fields
    pub id: String,
    pub post_id: String,
    pub parent_comment_id: Option<String>,
    pub user_id: Option<String>,
    pub content: String,
    pub updated_at: chrono::NaiveDateTime,
    // Reaction aggregation
    pub reaction_type: Option<String>,
    pub reaction_count: Option<i64>,
}

impl From<Vec<CommentWithReactionsRow>> for Comment {
    fn from(rows: Vec<CommentWithReactionsRow>) -> Self {
        let first_row = &rows[0];
        let mut reactions = HashMap::new();

        // Initialize all reaction types with count 0
        for reaction_type in ReactionType::all() {
            reactions.insert(reaction_type, 0);
        }

        // Aggregate reaction counts from database
        for row in &rows {
            if let (Some(reaction_type), Some(count)) = (&row.reaction_type, row.reaction_count) {
                let reaction = ReactionType::from(reaction_type);
                reactions.insert(reaction, count as u16);
            }
        }

        Comment {
            id: Some(CommentId::new(first_row.id.clone())),
            post_id: Some(PostId::new(first_row.post_id.clone())),
            parent_comment_id: first_row
                .parent_comment_id
                .as_ref()
                .map(|id| CommentId::new(id.clone())),
            user_id: first_row.user_id.as_ref().map(UserId::from),
            content: first_row.content.clone(),
            updated_at: Some(first_row.updated_at),
            reactions,
        }
    }
}

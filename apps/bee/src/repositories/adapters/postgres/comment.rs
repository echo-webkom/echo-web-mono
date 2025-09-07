use async_trait::async_trait;

use std::collections::HashMap;

use crate::{
    models::{
        database::CommentWithReactionsRow,
        domain::{
            Comment,
            shared::{
                comment_id::CommentId, post_id::PostId, reaction_type::ReactionType,
                user_id::UserId,
            },
        },
    },
    repositories::comments::CommentRepository,
    storage::postgres::Postgres,
};

#[derive(Clone)]
pub struct PostgresCommentRepository {
    postgres: Postgres,
}

impl PostgresCommentRepository {
    pub fn new(postgres: Postgres) -> Self {
        Self { postgres }
    }
}

#[async_trait]
impl CommentRepository for PostgresCommentRepository {
    async fn add_comment(&self, comment: Comment) -> anyhow::Result<()> {
        sqlx::query!(
            "INSERT INTO comment (post_id, parent_comment_id, user_id, content, updated_at)
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)",
            comment.post_id.as_ref().map(|id| id.value()),
            comment.parent_comment_id.as_ref().map(|id| id.value()),
            comment.user_id.as_ref().map(|id| id.value()),
            comment.content
        )
        .execute(&self.postgres.get_pool())
        .await?;

        Ok(())
    }

    async fn get_comments(&self, post_id: PostId) -> anyhow::Result<Vec<Comment>> {
        let rows = sqlx::query_as!(
            CommentWithReactionsRow,
            r#"--sql
            SELECT
                c.id,
                c.post_id,
                c.parent_comment_id,
                c.user_id,
                c.content,
                c.updated_at,
                cr.type as "reaction_type?: String",
                COUNT(cr.type) as "reaction_count?: i64"
            FROM comment c
            LEFT JOIN comments_reactions cr ON c.id = cr.comment_id
            WHERE c.post_id = $1
            GROUP BY c.id, c.post_id, c.parent_comment_id, c.user_id, c.content, c.updated_at, cr.type
            ORDER BY c.updated_at DESC
            "#,
            post_id.value()
        )
        .fetch_all(&self.postgres.get_pool())
        .await?;

        let mut comment_groups: HashMap<String, Vec<CommentWithReactionsRow>> = HashMap::new();

        for row in rows {
            let comment_id = row.id.clone();
            comment_groups.entry(comment_id).or_default().push(row);
        }

        let comments = comment_groups.into_values().map(Comment::from).collect();

        Ok(comments)
    }

    async fn add_comment_reaction(
        &self,
        comment_id: CommentId,
        user_id: UserId,
        reaction_type: ReactionType,
    ) -> anyhow::Result<()> {
        let comment_id = comment_id.value();
        let user_id = user_id.value();
        let reaction_type = &reaction_type.to_string();

        sqlx::query!(
            "INSERT INTO comments_reactions (comment_id, user_id, type)
             VALUES ($1, $2, $3)",
            comment_id,
            user_id,
            reaction_type as _
        )
        .execute(&self.postgres.get_pool())
        .await?;

        Ok(())
    }
}

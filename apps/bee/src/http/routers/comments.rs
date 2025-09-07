use axum::{
    Json, Router,
    extract::{Path, State},
    response::IntoResponse,
    routing::{get, post},
};

use crate::{
    errors::ApiError,
    http::{extract::admin::AdminAuth, server::AppState},
    models::{
        domain::shared::{
            comment_id::CommentId, post_id::PostId, reaction_type::ReactionType, user_id::UserId,
        },
        dto::{CreateCommentRequest, request::comment::CreateCommentReactionRequest},
    },
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/comments/{id}", get(get_comments))
        .route("/comments/{id}", post(post_comment))
        .route("/comments/{id}/react", post(react_to_comment))
}

/// Get the comments for a specific commentable entity.
///
/// # Authentication
///
/// This endpoint requires admin authentication.
async fn get_comments(
    State(state): State<AppState>,
    Path(id): Path<String>,
    _auth: AdminAuth,
) -> Result<impl IntoResponse, ApiError> {
    let post_id = PostId::from(id);
    let comments = state.comment_service.get_comments_by_post(post_id).await?;

    Ok(Json(comments))
}

/// Post a new comment to a specific commentable entity.
///
/// # Authentication
///
/// This endpoint requires admin authentication.
async fn post_comment(
    State(state): State<AppState>,
    Path(id): Path<String>,
    Json(body): Json<CreateCommentRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let post_id = PostId::from(id);
    let body = CreateCommentRequest {
        post_id: post_id.value().to_string(),
        ..body
    };
    state.comment_service.create_comment(body).await?;

    Ok("Post a new comment")
}

/// React to a comment
///
/// # Authentication
///
/// This endpoint requires admin authentication.
async fn react_to_comment(
    State(state): State<AppState>,
    Path(id): Path<String>,
    _auth: AdminAuth,
    Json(body): Json<CreateCommentReactionRequest>,
) -> Result<impl IntoResponse, ApiError> {
    let comment_id = CommentId::from(id);
    let reaction = ReactionType::from(body.reaction_type);
    let user_id = UserId::from(body.user_id);

    state
        .comment_service
        .react_to_comment(comment_id, user_id, reaction)
        .await?;

    Ok("React to a comment")
}

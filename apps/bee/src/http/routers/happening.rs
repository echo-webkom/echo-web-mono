use axum::{Json, Router, extract::State, response::IntoResponse, routing::get};

use crate::{errors::ApiError, http::server::AppState, models::dto::HappeningResponse};

pub fn routes() -> Router<AppState> {
    Router::new().route("/happenings", get(list_happenings))
}

async fn list_happenings(State(state): State<AppState>) -> Result<impl IntoResponse, ApiError> {
    let happenings = state
        .happening_service
        .list_happenings()
        .await
        .map_err(ApiError::from)?
        .into_iter()
        .map(HappeningResponse::from)
        .collect::<Vec<_>>();

    Ok(Json(happenings))
}

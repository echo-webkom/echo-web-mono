#![allow(dead_code)]

use axum::{
    extract::FromRequestParts,
    http::{header::AUTHORIZATION, request::Parts},
};

use crate::{errors::ApiError, http::server::AppState};

pub struct AdminAuth;

impl FromRequestParts<AppState> for AdminAuth {
    type Rejection = ApiError;

    async fn from_request_parts(parts: &mut Parts, state: &AppState) -> Result<Self, ApiError> {
        let headers = parts.headers.clone();
        let auth_header = headers
            .get(AUTHORIZATION)
            .and_then(|h| h.to_str().ok())
            .unwrap_or("");

        if auth_header != state.admin_key {
            return Err(ApiError::Unauthorized("Invalid admin key".into()));
        }

        Ok(AdminAuth)
    }
}

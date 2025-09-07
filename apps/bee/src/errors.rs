#[derive(Debug, Clone)]
pub enum ApiError {
    NotFound(String),
    Unauthorized(String),
    BadRequest(String),
    InternalServerError(String),
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApiError::NotFound(msg) => write!(f, "Not Found: {}", msg),
            ApiError::Unauthorized(msg) => write!(f, "Unauthorized: {}", msg),
            ApiError::BadRequest(msg) => write!(f, "Bad Request: {}", msg),
            ApiError::InternalServerError(msg) => write!(f, "Internal Server Error: {}", msg),
        }
    }
}

impl std::error::Error for ApiError {}

impl From<anyhow::Error> for ApiError {
    fn from(err: anyhow::Error) -> Self {
        ApiError::InternalServerError(err.to_string())
    }
}

impl axum::response::IntoResponse for ApiError {
    fn into_response(self) -> axum::response::Response {
        let (status, msg) = match self {
            ApiError::NotFound(msg) => (axum::http::StatusCode::NOT_FOUND, msg),
            ApiError::Unauthorized(msg) => (axum::http::StatusCode::UNAUTHORIZED, msg),
            ApiError::BadRequest(msg) => (axum::http::StatusCode::BAD_REQUEST, msg),
            ApiError::InternalServerError(msg) => {
                (axum::http::StatusCode::INTERNAL_SERVER_ERROR, msg)
            }
        };
        let body = serde_json::json!({ "error": msg });
        (status, axum::Json(body)).into_response()
    }
}

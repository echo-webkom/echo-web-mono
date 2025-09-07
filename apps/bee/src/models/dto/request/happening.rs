use serde::Deserialize;

use crate::models::domain::Happening;

#[derive(Debug, Deserialize)]
pub struct CreateHappeningRequest {
    pub title: String,
    pub description: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateHappeningRequest {
    pub title: Option<String>,
    pub description: Option<String>,
}

impl From<CreateHappeningRequest> for Happening {
    fn from(req: CreateHappeningRequest) -> Self {
        Happening {
            id: String::new(),
            title: req.title,
            description: req.description,
            created_at: chrono::Utc::now(),
        }
    }
}

use serde::Serialize;

use crate::models::domain::Happening;

#[derive(Debug, Serialize)]
pub struct HappeningResponse {
    pub id: String,
    pub title: String,
    pub description: String,
    pub created_at: String, // ISO 8601 formatted
}

#[derive(Debug, Serialize)]
pub struct HappeningListResponse {
    pub happenings: Vec<HappeningResponse>,
    pub total: usize,
}

impl From<Happening> for HappeningResponse {
    fn from(happening: Happening) -> Self {
        HappeningResponse {
            id: happening.id,
            title: happening.title,
            description: happening.description,
            created_at: happening.created_at.to_rfc3339(),
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct Happening {
    pub id: String,
    pub title: String,
    pub description: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

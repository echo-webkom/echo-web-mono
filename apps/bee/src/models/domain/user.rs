#[derive(Debug, Clone, PartialEq)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub name: String,
    pub created_at: chrono::DateTime<chrono::Utc>,
}

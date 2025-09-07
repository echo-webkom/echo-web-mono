use crate::models::domain::shared::email::Email;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct AccessRequestId(String);

impl AccessRequestId {
    pub fn new(id: String) -> Self {
        Self(id)
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

#[derive(Debug, Clone)]
pub struct AccessRequest {
    pub id: AccessRequestId,
    pub email: Email,
    pub reason: String,
    pub created_at: chrono::NaiveDateTime,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct UserId(String);

impl Default for UserId {
    fn default() -> Self {
        Self::new()
    }
}

impl UserId {
    pub fn new() -> Self {
        Self(uuid::Uuid::new_v4().to_string())
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

impl<T: AsRef<str>> From<T> for UserId {
    fn from(value: T) -> Self {
        Self(value.as_ref().to_string())
    }
}

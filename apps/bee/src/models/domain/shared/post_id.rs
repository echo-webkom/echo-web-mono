#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct PostId(String);

impl PostId {
    pub fn new(id: String) -> Self {
        Self(id)
    }

    pub fn value(&self) -> &str {
        &self.0
    }

    // Validation function
    pub fn validate(value: String) -> Result<Self, &'static str> {
        if value.is_empty() {
            return Err("Post ID cannot be empty");
        }
        // TODO: Add more validation here as needed
        Ok(PostId(value))
    }
}

impl<T: AsRef<str>> From<T> for PostId {
    fn from(value: T) -> Self {
        Self(value.as_ref().to_string())
    }
}

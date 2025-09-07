#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct CommentId(String);

impl CommentId {
    pub fn new(id: String) -> Self {
        Self(id)
    }

    pub fn value(&self) -> &str {
        &self.0
    }
}

impl<T: AsRef<str>> From<T> for CommentId {
    fn from(value: T) -> Self {
        Self(value.as_ref().to_string())
    }
}

#[derive(Clone, Debug, PartialEq, Eq, Hash)]
pub enum ReactionType {
    Like,
}

impl ReactionType {
    pub fn all() -> Vec<ReactionType> {
        vec![ReactionType::Like]
    }
}

impl<T: AsRef<str>> From<T> for ReactionType {
    fn from(s: T) -> Self {
        match s.as_ref() {
            "like" => ReactionType::Like,
            _ => ReactionType::Like,
        }
    }
}

impl std::fmt::Display for ReactionType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ReactionType::Like => write!(f, "like"),
        }
    }
}

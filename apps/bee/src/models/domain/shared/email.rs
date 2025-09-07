#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Email(String);

impl Email {
    pub fn new(email: String) -> anyhow::Result<Self> {
        if Self::is_valid(&email) {
            Ok(Self(email))
        } else {
            Err(anyhow::anyhow!("Invalid email format"))
        }
    }

    pub fn value(&self) -> &str {
        &self.0
    }

    pub fn is_valid(email: &str) -> bool {
        let email_regex = regex::Regex::new(r"^[^\s@]+@[^\s@]+\.[^\s@]+$").unwrap();
        email_regex.is_match(email)
    }
}

pub struct Config {
    pub database_url: String,
    pub admin_key: String,
}

impl Config {
    pub fn load() -> anyhow::Result<Self> {
        dotenvy::dotenv().ok();

        let database_url = load_required("DATABASE_URL");
        let admin_key = load_required("ADMIN_KEY");

        Ok(Self {
            database_url,
            admin_key,
        })
    }
}

fn load_required(key: &str) -> String {
    std::env::var(key).unwrap_or_else(|_| panic!("{} must be set", key))
}

#[allow(dead_code)]
fn load_optional(key: &str) -> Option<String> {
    std::env::var(key).ok().or(None)
}

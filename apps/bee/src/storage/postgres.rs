#[derive(Debug, Clone)]
pub struct Postgres {
    pool: sqlx::PgPool,
}

impl Postgres {
    pub async fn new(url: &str) -> anyhow::Result<Self> {
        let pool = sqlx::PgPool::connect(url).await?;

        Ok(Self { pool })
    }

    pub fn get_pool(&self) -> sqlx::PgPool {
        self.pool.clone()
    }
}

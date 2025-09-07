use async_trait::async_trait;

use crate::{repositories::happening::HappeningRepository, storage::postgres::Postgres};

#[derive(Clone)]
pub struct PostgresHappeningRepository {
    postgres: Postgres,
}

impl PostgresHappeningRepository {
    pub fn new(postgres: Postgres) -> Self {
        Self { postgres }
    }
}

#[async_trait]
impl HappeningRepository for PostgresHappeningRepository {
    async fn find_all(&self) -> Vec<String> {
        sqlx::query!("SELECT title FROM happening")
            .fetch_all(&self.postgres.get_pool())
            .await
            .unwrap()
            .into_iter()
            .map(|record| record.title)
            .collect()
    }
}

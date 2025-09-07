use async_trait::async_trait;
use chrono::{DateTime, Local};

use crate::{models::domain::Happening, repositories::happening::HappeningRepository};

#[async_trait]
pub trait HappeningService: Send + Sync {
    /// Gets all happenings
    async fn list_happenings(&self) -> anyhow::Result<Vec<Happening>>;
}

#[derive(Clone)]
pub struct HappeningServiceImpl<R: HappeningRepository + Send + Sync + Clone> {
    happening_repository: R,
}

impl<R: HappeningRepository + Send + Sync + Clone> HappeningServiceImpl<R> {
    pub fn new(happening_repository: R) -> Self {
        Self {
            happening_repository,
        }
    }
}

#[async_trait]
impl<R: HappeningRepository + Send + Sync + Clone> HappeningService for HappeningServiceImpl<R> {
    async fn list_happenings(&self) -> anyhow::Result<Vec<Happening>> {
        let happenings = self.happening_repository.find_all().await;

        let dt = Local::now();
        let naive_utc = dt.naive_utc();
        let offset = dt.offset().clone();

        let responses = happenings
            .into_iter()
            .map(|title| Happening {
                title,
                id: String::new(),
                created_at: DateTime::<Local>::from_naive_utc_and_offset(naive_utc, offset)
                    .to_utc(),
                description: String::new(),
            })
            .collect();

        Ok(responses)
    }
}

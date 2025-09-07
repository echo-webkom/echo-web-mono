use async_trait::async_trait;

#[async_trait]
pub trait HappeningRepository {
    async fn find_all(&self) -> Vec<String>;
}

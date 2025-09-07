use async_trait::async_trait;

#[async_trait]
pub trait AccessRequestRepository {
    fn count_pending_requests(&self) -> impl std::future::Future<Output = i64> + Send;

    fn approve_request(
        &self,
        request_id: String,
        duration: chrono::Duration,
    ) -> impl std::future::Future<Output = ()> + Send;

    fn deny_request(&self, request_id: String) -> impl std::future::Future<Output = ()> + Send;

    fn create_request(&self, user_id: String) -> impl std::future::Future<Output = i32> + Send;

    fn list_requests(&self) -> impl std::future::Future<Output = Vec<(i32, i32, String)>> + Send;
}

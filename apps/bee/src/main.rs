pub mod config;
pub mod errors;
pub mod http;
pub mod models;
pub mod repositories;
pub mod services;
pub mod storage;

use std::sync::Arc;

use crate::{
    config::Config,
    http::server::{Server, ServerOptions},
    repositories::{PostgresHappeningRepository, adapters::postgres::PostgresCommentRepository},
    services::{CommentServiceImpl, happening::HappeningServiceImpl},
    storage::postgres::Postgres,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let config = Config::load()?;

    let postgres = Postgres::new(&config.database_url).await?;

    // Repositories
    let happening_repo = PostgresHappeningRepository::new(postgres.clone());
    let comment_repo = PostgresCommentRepository::new(postgres.clone());

    // Services
    let happening_service = Arc::new(HappeningServiceImpl::new(happening_repo));
    let comment_service = Arc::new(CommentServiceImpl::new(comment_repo));

    let server_options = ServerOptions { port: 8080 };
    Server::new(server_options, config, happening_service, comment_service)
        .await?
        .with_tracing()
        .run()
        .await?;

    Ok(())
}

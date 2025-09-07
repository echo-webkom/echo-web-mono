use std::sync::Arc;

use axum::Router;
use tokio::net::TcpListener;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::{
    config::Config,
    http::routers::{comments, happening},
    services::{comment::CommentService, happening::HappeningService},
};

#[derive(Clone)]
pub struct AppState {
    pub admin_key: String,
    pub happening_service: Arc<dyn HappeningService>,
    pub comment_service: Arc<dyn CommentService>,
}
pub struct ServerOptions {
    pub port: u16,
}

impl Default for ServerOptions {
    fn default() -> Self {
        Self { port: 8080 }
    }
}

pub struct Server {
    options: ServerOptions,
    router: Router,
}

impl Server {
    pub async fn new(
        options: ServerOptions,
        config: Config,
        happening_service: Arc<dyn HappeningService>,
        comment_service: Arc<dyn CommentService>,
    ) -> anyhow::Result<Self> {
        let state = AppState {
            admin_key: config.admin_key.clone(),
            happening_service,
            comment_service,
        };

        let router = Router::new()
            .merge(happening::routes())
            .merge(comments::routes())
            .with_state(state);

        Ok(Self { options, router })
    }

    pub async fn run(self) -> anyhow::Result<()> {
        let listener = TcpListener::bind(format!("127.0.0.1:{}", self.options.port)).await?;

        tracing::debug!("🐝 Running BEE on http://localhost:{}", self.options.port);

        axum::serve(listener, self.router).await?;

        Ok(())
    }

    pub fn with_tracing(self) -> Self {
        tracing_subscriber::registry()
            .with(
                tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                    // axum logs rejections from built-in extractors with the `axum::rejection`
                    // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
                    format!(
                        "{}=debug,tower_http=debug,axum::rejection=trace",
                        env!("CARGO_CRATE_NAME")
                    )
                    .into()
                }),
            )
            .with(tracing_subscriber::fmt::layer())
            .init();

        self
    }
}

use crate::config::Config;
use crate::services::{AuthenticationService, TodoService};
use std::{error::Error, net::SocketAddr, sync::Arc};
use supabase_rust::Supabase;

pub mod config;
mod services;
mod supabase_wrapper;

pub async fn start(config: Config) -> Result<(), Box<dyn Error>> {
    tracing::info!(
        "Server being hosted at http://{}",
        SocketAddr::new(config.addr, config.port)
    );

    let supabase = Arc::new(Supabase::new(
        Some(&config.sb_url),
        Some(&config.sb_apikey),
        Some(&config.sb_jwt),
    ));

    axum::Server::bind(&SocketAddr::new(config.addr, config.port))
        .serve(
            axum::routing::Router::new()
                .route(
                    "/auth.v1.Authentication/*rpc",
                    AuthenticationService::new(Arc::clone(&supabase)),
                )
                .route(
                    "/todo.v1.Todo/*rpc",
                    TodoService::new(Arc::clone(&supabase)),
                )
                .into_make_service(),
        )
        .await?;

    Ok(())
}

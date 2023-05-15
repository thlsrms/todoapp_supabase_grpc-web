use crate::{
    config::Config,
    services::{AuthenticationService, TodoService},
};
use std::{error::Error, net::SocketAddr, sync::Arc};
use supabase_rust::Supabase;
use tonic::codegen::http::HeaderName;
use tower_http::{
    cors::{Any, CorsLayer},
    trace::TraceLayer,
};

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
                .layer(
                    // Layer needed while not serving the client
                    CorsLayer::new()
                        .allow_origin(Any)
                        .allow_headers(Any)
                        .allow_methods(Any)
                        .expose_headers([
                            HeaderName::from_static("grpc-encoding"),
                            HeaderName::from_static("grpc-status"),
                            HeaderName::from_static("grpc-message"),
                        ]),
                )
                .route(
                    "/auth.v1.Authentication/*rpc",
                    AuthenticationService::new(&config, Arc::clone(&supabase))
                        .layer(TraceLayer::new_for_grpc()),
                )
                .route(
                    "/todo.v1.Todo/*rpc",
                    TodoService::new(Arc::clone(&supabase)).layer(TraceLayer::new_for_grpc()),
                )
                .into_make_service(),
        )
        .await?;

    Ok(())
}

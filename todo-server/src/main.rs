#[tokio::main]
async fn main() {
    std::env::set_var("RUST_LOG", "debug,hyper=info,mio=info");
    tracing_subscriber::fmt::init();
    let config = todo_server::config::Config::init();
    todo_server::start(config).await.unwrap();
}

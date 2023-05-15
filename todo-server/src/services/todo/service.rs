use super::proto::todo::v1::{
    todo_server::{Todo, TodoServer},
    CreateTaskRequest, CreateTaskResponse, DeleteTaskRequest, DeleteTaskResponse, FetchTaskRequest,
    FetchTaskResponse, UpdateTaskRequest, UpdateTaskResponse,
};
use std::sync::Arc;
use supabase_rust::Supabase;
use tonic::{codegen::CompressionEncoding, Request, Response, Status};

pub struct TodoService {
    _supabase: Arc<Supabase>,
}

#[tonic::async_trait]
impl Todo for TodoService {
    async fn create_task(
        &self,
        _request: Request<CreateTaskRequest>,
    ) -> Result<Response<CreateTaskResponse>, Status> {
        unimplemented!();
    }

    async fn fetch_task(
        &self,
        _request: Request<FetchTaskRequest>,
    ) -> Result<Response<FetchTaskResponse>, Status> {
        unimplemented!();
    }

    async fn update_task(
        &self,
        _request: Request<UpdateTaskRequest>,
    ) -> Result<Response<UpdateTaskResponse>, Status> {
        unimplemented!();
    }

    async fn delete_task(
        &self,
        _request: Request<DeleteTaskRequest>,
    ) -> Result<Response<DeleteTaskResponse>, Status> {
        unimplemented!();
    }
}

impl TodoService {
    pub fn new(_supabase: Arc<Supabase>) -> axum::routing::MethodRouter {
        axum::routing::any_service(tonic_web::enable(
            TodoServer::new(TodoService { _supabase })
                .accept_compressed(CompressionEncoding::Gzip)
                .send_compressed(CompressionEncoding::Gzip),
        ))
    }
}

use super::auth_middleware::{self, Authorization};
use super::proto::todo::v1::todo_server::*;
use super::proto::todo::v1::*;
use super::schema;
use crate::services::grpc_status;
use crate::supabase_wrapper::utils::parse_response_query;
use std::{convert::Infallible, sync::Arc};
use supabase_rust::Supabase;
use tonic::codegen::{http::HeaderName, CompressionEncoding};
use tonic::service::interceptor;
use tonic::{Request, Response, Status};
use tower_http::cors::{self, CorsLayer};
use tower_http::trace::TraceLayer;

pub struct TodoService {
    supabase: Arc<Supabase>,
}

#[tonic::async_trait]
impl Todo for TodoService {
    async fn create_task(
        &self,
        req: Request<CreateTaskRequest>,
    ) -> Result<Response<CreateTaskResponse>, Status> {
        let Authorization { claims, token } = req.extensions().get::<Authorization>().unwrap();

        let new_task = serde_json::to_string(&schema::tasks::InsertTask {
            author_id: claims.sub.clone(),
            title: req.get_ref().title.clone(),
            description: req.get_ref().description.clone(),
        })
        .unwrap();

        let supabase_query = self
            .supabase
            .db()
            .from("tasks")
            .auth(&token)
            .insert(new_task)
            .execute()
            .await;

        match parse_response_query::<Vec<schema::tasks::QueryTask>>(supabase_query).await {
            Ok(res) => Ok(Response::new(CreateTaskResponse {
                task: Some(res[0].into_task()),
            })),
            Err(err) => return Err(grpc_status::from_supabase_error(err)),
        }
    }

    async fn fetch_task(
        &self,
        req: Request<FetchTaskRequest>,
    ) -> Result<Response<FetchTaskResponse>, Status> {
        let Authorization { claims, token } = req.extensions().get::<Authorization>().unwrap();

        // Start building the request
        let supabase_query_builder = self
            .supabase
            .db()
            .from("tasks")
            .auth(&token)
            .eq("author_id", &claims.sub)
            .select("*");

        let supabase_response = match req.get_ref().id {
            Some(id) => {
                // Filtering by a specific ID
                supabase_query_builder
                    .eq("id", id.to_string())
                    .execute()
                    .await
            }
            None => {
                match &req.get_ref().filter {
                    Some(filter) => {
                        // Fetch tasks that matches a search pattern. Case insensitive
                        match filter.filter_field() {
                            FilterField::FilterfieldUnspecified => {
                                supabase_query_builder
                                    .ilike("title", format!("%{}%", filter.pattern))
                                    .ilike("description", format!("%{}%", filter.pattern))
                                    .execute()
                                    .await
                            }
                            FilterField::FilterfieldTitle => {
                                supabase_query_builder
                                    .ilike("title", format!("%{}%", filter.pattern))
                                    .execute()
                                    .await
                            }
                            FilterField::FilterfieldDescription => {
                                supabase_query_builder
                                    .ilike("description", format!("%{}%", filter.pattern))
                                    .execute()
                                    .await
                            }
                        }
                    }
                    None => {
                        // No filter, fetch all
                        supabase_query_builder.execute().await
                    }
                }
            }
        };

        match parse_response_query::<Vec<schema::tasks::QueryTask>>(supabase_response).await {
            Ok(res) => Ok(Response::new(FetchTaskResponse {
                task_list: Some(TaskList {
                    tasks: res.into_iter().map(|t| t.into_task()).collect(),
                }),
            })),
            Err(err) => return Err(grpc_status::from_supabase_error(err)),
        }
    }

    async fn update_task(
        &self,
        req: Request<UpdateTaskRequest>,
    ) -> Result<Response<UpdateTaskResponse>, Status> {
        let Authorization { claims, token } = req.extensions().get::<Authorization>().unwrap();

        let updating_task = serde_json::to_string(&schema::tasks::QueryTask {
            id: req.get_ref().id,
            author_id: Some(claims.sub.clone()),
            title: req.get_ref().title.clone(),
            completed: req.get_ref().completed,
            description: req.get_ref().description.clone(),
        })
        .unwrap();

        let supabase_query = self
            .supabase
            .db()
            .from("tasks")
            .auth(&token)
            .update(updating_task)
            .eq("id", req.get_ref().id.to_string())
            .execute()
            .await;

        match parse_response_query::<Vec<schema::tasks::QueryTask>>(supabase_query).await {
            Ok(res) => Ok(Response::new(UpdateTaskResponse {
                task: Some(res[0].into_task()),
            })),
            Err(err) => return Err(grpc_status::from_supabase_error(err)),
        }
    }

    async fn delete_task(
        &self,
        req: Request<DeleteTaskRequest>,
    ) -> Result<Response<DeleteTaskResponse>, Status> {
        let Authorization { claims, token } = req.extensions().get::<Authorization>().unwrap();

        let supabase_query = self
            .supabase
            .db()
            .from("tasks")
            .auth(&token)
            .eq("author_id", &claims.sub)
            .eq("id", req.get_ref().id.to_string())
            .delete()
            .execute()
            .await;

        match parse_response_query::<Vec<schema::tasks::QueryTask>>(supabase_query).await {
            Ok(res) => Ok(Response::new(DeleteTaskResponse {
                task: Some(res[0].into_task()),
            })),
            Err(err) => return Err(grpc_status::from_supabase_error(err)),
        }
    }
}

impl TodoService {
    pub fn new(supabase: Arc<Supabase>) -> axum::routing::MethodRouter {
        axum::routing::any_service(tonic_web::enable(
            TodoServer::new(TodoService { supabase })
                .accept_compressed(CompressionEncoding::Gzip)
                .send_compressed(CompressionEncoding::Gzip),
        ))
        .layer::<_, _, Infallible>(interceptor(auth_middleware::validate_authorization))
        .layer::<_, _, Infallible>(TraceLayer::new_for_grpc())
        .layer(
            // Layer needed while not serving the client
            CorsLayer::new()
                .allow_origin(cors::Any)
                .allow_headers(cors::Any)
                .allow_methods(cors::Any)
                .expose_headers([
                    HeaderName::from_static("grpc-encoding"),
                    HeaderName::from_static("grpc-status"),
                    HeaderName::from_static("grpc-message"),
                ]),
        )
    }
}

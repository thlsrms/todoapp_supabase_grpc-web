use super::proto::auth::v1::{
    authentication_server::{Authentication, AuthenticationServer},
    Credentials, LogoutRequest, LogoutResponse, SigninEmailPasswordRequest,
    SigninEmailPasswordResponse, SignupEmailPasswordRequest, SignupEmailPasswordResponse,
    UserToken,
};
use crate::supabase_wrapper::utils::parse_response;
use crate::{services::grpc_status, supabase_wrapper::response_types::AccessToken};
use prost::{bytes::Bytes, Message};
use std::sync::Arc;
use supabase_rust::Supabase;
use tonic::{codegen::CompressionEncoding, Request, Response, Status};

pub struct AuthenticationService {
    supabase: Arc<Supabase>,
}

#[tonic::async_trait]
impl Authentication for AuthenticationService {
    async fn signin_email_password(
        &self,
        request: Request<SigninEmailPasswordRequest>,
    ) -> Result<Response<SigninEmailPasswordResponse>, Status> {
        let credentials = match Credentials::decode(Bytes::from(request.into_inner().credentials)) {
            Ok(c) => c,
            Err(err) => {
                return Err(Status::internal(format!(
                    "Credentials decoding error: {}",
                    err
                )))
            }
        };

        let signup_supabase_response = parse_response::<AccessToken>(
            self.supabase
                .sign_in_password(&credentials.email, &credentials.password)
                .await,
        )
        .await;

        let access_token = match signup_supabase_response {
            Ok(t) => t,
            Err(e) => return Err(grpc_status::from_supabase_error(e)),
        };

        Ok(Response::new(SigninEmailPasswordResponse {
            token: Some(UserToken {
                value: access_token.access_token,
            }),
        }))
    }

    /// Crate a new account using email and password
    async fn signup_email_password(
        &self,
        request: Request<SignupEmailPasswordRequest>,
    ) -> Result<Response<SignupEmailPasswordResponse>, Status> {
        let credentials = match Credentials::decode(Bytes::from(request.into_inner().credentials)) {
            Ok(c) => c,
            Err(err) => {
                return Err(Status::internal(format!(
                    "Credentials decoding error: {}",
                    err
                )))
            }
        };

        let signup_supabase_response = parse_response::<AccessToken>(
            self.supabase
                .signup_email_password(&credentials.email, &credentials.password)
                .await,
        )
        .await;

        let access_token = match signup_supabase_response {
            Ok(t) => t,
            Err(e) => return Err(grpc_status::from_supabase_error(e)),
        };

        Ok(Response::new(SignupEmailPasswordResponse {
            token: Some(UserToken {
                value: access_token.access_token,
            }),
        }))
    }

    async fn logout(
        &self,
        request: Request<LogoutRequest>,
    ) -> Result<Response<LogoutResponse>, Status> {
        _ = if let Some(bearer_token) = request.metadata().get("Authorization") {
            _ = match bearer_token.to_str() {
                Ok(token) => self.supabase.logout(token.into()).await,
                Err(_) => {
                    return Err(Status::new(
                        tonic::Code::Internal,
                        "Error while parsing authorization token",
                    ))
                }
            };
        } else {
            return Err(Status::new(
                tonic::Code::Unauthenticated,
                "Missing authorization token",
            ));
        };
        Ok(Response::new(LogoutResponse {}))
    }
}

impl AuthenticationService {
    pub fn new(supabase: Arc<Supabase>) -> axum::routing::MethodRouter {
        axum::routing::any_service(tonic_web::enable(
            AuthenticationServer::new(AuthenticationService { supabase })
                .accept_compressed(CompressionEncoding::Gzip)
                .send_compressed(CompressionEncoding::Gzip),
        ))
        .layer::<_, _, std::convert::Infallible>(tower_http::trace::TraceLayer::new_for_grpc())
        .layer(
            // Layer needed while not serving the client
            tower_http::cors::CorsLayer::new()
                .allow_origin(tower_http::cors::Any)
                .allow_headers(tower_http::cors::Any)
                .allow_methods(tower_http::cors::Any)
                .expose_headers([
                    axum::http::HeaderName::from_static("grpc-encoding"),
                    axum::http::HeaderName::from_static("grpc-status"),
                    axum::http::HeaderName::from_static("grpc-message"),
                ]),
        )
    }
}

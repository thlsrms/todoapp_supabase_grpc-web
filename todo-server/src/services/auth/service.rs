use super::proto::auth::v1::{
    authentication_server::{Authentication, AuthenticationServer},
    Credentials, LogoutRequest, LogoutResponse, SigninPasswordRequest, SigninPasswordResponse,
    SignupEmailPasswordRequest, SignupEmailPasswordResponse, UserToken,
};
use crate::{config::Config, supabase_wrapper::utils::parse_response};
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
    async fn signin_password(
        &self,
        request: Request<SigninPasswordRequest>,
    ) -> Result<Response<SigninPasswordResponse>, Status> {
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
            Err(e) => return Err(Status::new(grpc_status::from_http_code(e.code), e.msg)),
        };

        dbg!(format!("user: {:?}", access_token.user));

        Ok(Response::new(SigninPasswordResponse {
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
            Err(e) => return Err(Status::new(grpc_status::from_http_code(e.code), e.msg)),
        };

        dbg!(format!("user: {:?}", access_token.user));

        Ok(Response::new(SignupEmailPasswordResponse {
            token: Some(UserToken {
                value: access_token.access_token,
            }),
        }))
    }

    async fn logout(
        &self,
        _request: Request<LogoutRequest>,
    ) -> Result<Response<LogoutResponse>, Status> {
        unimplemented!();
    }
}

impl AuthenticationService {
    pub fn new(_config: &Config, supabase: Arc<Supabase>) -> axum::routing::MethodRouter {
        axum::routing::any_service(tonic_web::enable(
            AuthenticationServer::new(AuthenticationService { supabase })
                .accept_compressed(CompressionEncoding::Gzip)
                .send_compressed(CompressionEncoding::Gzip),
        ))
    }
}

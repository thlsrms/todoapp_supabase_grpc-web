use jsonwebtoken::{decode, Algorithm, DecodingKey, Validation};
use lazy_static::lazy_static;
use serde::Deserialize;
use tonic::{Request, Status};

lazy_static! {
    static ref SUPABASE_JWT: String = std::env::var("SUPABASE_JWT").unwrap();
}

#[derive(Deserialize)]
pub struct Authorization {
    pub claims: Claims,
    pub token: String,
}

#[derive(Deserialize)]
pub struct Claims {
    pub sub: String,
    pub email: String,
    pub exp: usize,
}

pub fn validate_authorization(mut req: Request<()>) -> Result<Request<()>, Status> {
    let metadata = req.metadata().to_owned();

    match metadata.get("authorization") {
        Some(t) => {
            let decoding_key = DecodingKey::from_secret(SUPABASE_JWT.as_ref()).into();
            let validation = Validation::new(Algorithm::HS256);
            let decoded_token = decode::<Claims>(
                &t.to_str().unwrap().replace("Bearer ", ""),
                &decoding_key,
                &validation,
            );

            match decoded_token {
                Ok(token_data) => {
                    req.extensions_mut().insert(Authorization {
                        claims: Claims {
                            sub: token_data.claims.sub,
                            email: token_data.claims.email,
                            exp: token_data.claims.exp,
                        },
                        token: t.to_str().unwrap().replace("Bearer ", "").to_string(),
                    });

                    Ok(req)
                }
                Err(_) => {
                    return Err(Status::new(
                        tonic::Code::PermissionDenied,
                        "Invalid authorization token",
                    ))
                }
            }
        }
        None => {
            return Err(Status::new(
                tonic::Code::Unauthenticated,
                "Missing authorization token",
            ));
        }
    }
}

use super::response_types::ErrorResponse;

/// This function parses a request result from the `supabase_rust` crate.
/// It requires a Generic type that implements the `serde::Deserialize` trait.
pub async fn parse_response<T>(
    response: Result<reqwest::Response, reqwest::Error>,
) -> Result<T, ErrorResponse>
where
    T: serde::de::DeserializeOwned,
{
    let ok: T = match response {
        Ok(res) if res.status().as_u16() != 200 => match res.json::<ErrorResponse>().await {
            Ok(supabase_err) => {
                return Err(supabase_err);
            }
            Err(_) => return Err(deserialize_error()),
        },

        Ok(res) => match res.json::<T>().await {
            Ok(t) => t,
            Err(_) => return Err(deserialize_error()),
        },

        Err(e) => {
            return Err(ErrorResponse {
                error: None,
                error_description: None,
                code: Some(e.status().unwrap().as_u16()),
                msg: Some("An unexpected error ocurred".to_string()),
            })
        }
    };
    Ok(ok)
}

fn deserialize_error() -> ErrorResponse {
    ErrorResponse {
        error: None,
        error_description: None,
        code: Some(500),
        msg: Some("Error deserializing response".to_string()),
    }
}

/// Postgrest REST response parser
/// It requires a Generic type that implements the `serde::Deserialize` trait.
pub async fn parse_response_query<T>(
    response: Result<reqwest::Response, reqwest::Error>,
) -> Result<Vec<T>, ErrorResponse>
where
    T: serde::de::DeserializeOwned,
{
    match response {
        Ok(res) if res.status().as_u16() > 299 => Err(ErrorResponse {
            error: None,
            error_description: None,
            code: Some(res.status().as_u16()),
            msg: Some("Something went wrong with the request".to_string()),
        }),

        Ok(res) => match res.json::<Vec<T>>().await {
            Ok(t) => Ok(t),
            Err(_) => Err(deserialize_error()),
        },

        Err(e) => Err(ErrorResponse {
            error: None,
            error_description: None,
            code: Some(e.status().unwrap().as_u16()),
            msg: Some("An unexpected error ocurred".to_string()),
        }),
    }
}

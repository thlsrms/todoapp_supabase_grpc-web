use super::response_types::ErrorResponse;

/// This function parses a request result from the `supabase_rust` crate.
/// It requires a Response Type, defined inside the `response_types` module, as generic.
/// New Response types should be added according to custom response from triggers or functions.
pub async fn parse_response<T: serde::de::DeserializeOwned>(
    response: Result<reqwest::Response, reqwest::Error>,
) -> Result<T, ErrorResponse> {
    let ok: T = match response {
        Ok(res) => {
            if res.status().as_u16() != 200 {
                match res.json::<ErrorResponse>().await {
                    Ok(supabase_err) => {
                        return Err(supabase_err);
                    }
                    Err(_) => return Err(deserialize_error()),
                }
            }

            match res.json::<T>().await {
                Ok(t) => t,
                Err(_) => return Err(deserialize_error()),
            }
        }
        Err(e) => {
            return Err(ErrorResponse {
                error: None,
                error_description: None,
                code: e.status().unwrap().as_u16(),
                msg: "An unexpected error ocurred".to_string(),
            })
        }
    };
    Ok(ok)
}

fn deserialize_error() -> ErrorResponse {
    ErrorResponse {
        error: None,
        error_description: None,
        code: 500,
        msg: "Error deserializing response".to_string(),
    }
}

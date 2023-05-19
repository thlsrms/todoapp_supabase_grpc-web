use super::response_types::ErrorResponse;

/// This function parses a request result from the `supabase_rust` crate.
/// It requires a Response Type, defined inside the `response_types` module, as generic.
/// New Response types should be added according to custom response from triggers or functions.
pub async fn parse_response<T>(
    response: Result<reqwest::Response, reqwest::Error>,
) -> Result<T, ErrorResponse>
where
    T: serde::de::DeserializeOwned,
{
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

pub async fn parse_response_query<T>(
    res: Result<reqwest::Response, reqwest::Error>,
) -> Result<T, ErrorResponse>
where
    T: serde::de::DeserializeOwned,
{
    let ok: T = match res {
        Ok(res) => {
            if res.status().as_u16() > 299 {
                return Err(ErrorResponse {
                    error: None,
                    error_description: None,
                    code: Some(res.status().as_u16()),
                    msg: Some("Something went wrong with the request".to_string()),
                });
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
                code: Some(e.status().unwrap().as_u16()),
                msg: Some("An unexpected error ocurred".to_string()),
            })
        }
    };
    Ok(ok)
}

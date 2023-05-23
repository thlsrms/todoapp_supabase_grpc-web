// Error schema as outlined in https://github.com/supabase/gotrue/blob/master/openapi.yaml
//
//**Notes:**
//- HTTP 5XX errors are not listed for each endpoint.
//  These should be handled globally. Not all HTTP 5XX errors are generated from GoTrue, and they
//  may serve non-JSON content. Make sure you inspect the `Content-Type` header before parsing as JSON.
//- Error responses are somewhat inconsistent.
//  Avoid using the `msg` and HTTP status code to identify errors. HTTP 400 and 422 are used
//  interchangeably in many APIs.
//- If the server has CAPTCHA protection enabled, the verification token should be included in the
//  request body.
//- Rate limit errors are consistently raised with the HTTP 429 code.
//- Enums are used only in request bodies / parameters and not in responses to ensure wide
//  compatibility with code generators that fail to include an unknown enum case.

#[derive(serde::Deserialize, Debug)]
pub struct SupabaseError {
    /// Certain responses will contain this property with the provided values.
    /// Usually one of these:
    ///     - invalid_request
    ///     - unauthorized_client
    ///     - access_denied
    ///     - server_error
    ///     - temporarily_unavailable
    ///     - unsupported_otp_type
    pub error: Option<String>,

    /// Certain responses that have an `error` property may have this property which describes the error.
    pub error_description: Option<String>,

    /// The HTTP status code. Usually missing if `error` is present.
    /// Example: 400
    pub code: Option<u16>,

    /// A basic message describing the problem with the request. Usually missing if `error` is present.
    pub msg: Option<String>,
}

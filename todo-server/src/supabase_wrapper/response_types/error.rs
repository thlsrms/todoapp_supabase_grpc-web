#[derive(serde::Deserialize, Debug)]
pub struct ErrorResponse {
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
    pub code: u16,

    /// A basic message describing the problem with the request. Usually missing if `error` is present.
    pub msg: String,
}

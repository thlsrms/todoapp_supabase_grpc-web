use crate::supabase_wrapper::response_types::ErrorResponse;

pub fn code_from_http(http_response_code: u16) -> tonic::Code {
    match http_response_code {
        // From 200 through 299 return Ok
        200..=299 => tonic::Code::Ok,
        // 400 - not mapped: tonic::Code::OutOfRange
        // 400 - not mapped: tonic::Code::FailedPrecondition
        400 => tonic::Code::InvalidArgument,
        401 => tonic::Code::Unauthenticated,
        403 => tonic::Code::PermissionDenied,
        404 => tonic::Code::NotFound,
        409 => tonic::Code::Aborted,
        422 => tonic::Code::InvalidArgument,
        429 => tonic::Code::ResourceExhausted,
        // 500 - not mapped: tonic::Code::DataLoss
        500 => tonic::Code::Internal,
        501 => tonic::Code::Unimplemented,
        503 => tonic::Code::Unavailable,
        504 => tonic::Code::DeadlineExceeded,
        _ => tonic::Code::Unknown,
    }
}

pub fn from_supabase_error(error: ErrorResponse) -> tonic::Status {
    // If "code" is available "msg" should also be available
    // the same for "error" and "error_description".
    if error.code.is_some() {
        return tonic::Status::new(code_from_http(error.code.unwrap()), error.msg.unwrap());
    }
    return tonic::Status::new(
        match error.error.unwrap().as_ref() {
            "invalid_request" => tonic::Code::InvalidArgument,
            "unauthorized_client" => tonic::Code::Unauthenticated,
            "access_denied" => tonic::Code::PermissionDenied,
            "server_error" => tonic::Code::Internal,
            "temporarily_unavailable" => tonic::Code::Unavailable,
            "unsupported_otp_type" => tonic::Code::InvalidArgument,
            _ => tonic::Code::Unknown,
        },
        error.error_description.unwrap(),
    );
}

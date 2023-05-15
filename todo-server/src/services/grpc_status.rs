pub fn from_http_code(http_response_code: u16) -> tonic::Code {
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

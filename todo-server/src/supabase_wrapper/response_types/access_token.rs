#[derive(serde::Deserialize)]
pub struct AccessToken {
    /// A valid JWT that will expire in `expires_in` seconds.
    pub access_token: String,

    /// An opaque string that can be used once to obtain a new access and refresh token.
    pub refresh_token: String,

    /// What type of token this is. Only `bearer` returned, may change in the future.
    pub token_type: String,

    /// Number of seconds after which the `access_token` should be renewed
    /// by using the refresh token with the `refresh_token` grant type
    pub expires_in: i32,

    pub user: super::User,
}

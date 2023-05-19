/// Schema describing the user related to the issued access and refresh tokens.
#[derive(serde::Deserialize)]
pub struct User {
    /// format: uuid
    pub id: String,

    /// deprecated
    pub aud: String,

    pub role: String,

    /// User's primary contact email.
    /// In most cases you can uniquely identify a user by their email address, but not in all cases.
    pub email: String,

    /// format: date-time
    pub email_confirmed_at: String,

    /// format: phone
    /// User's primary contact phone number.
    /// In most cases you can uniquely identify a user by their email address, but not in all cases.
    pub phone: String,

    /// format: date-time
    pub phone_confirmed_at: Option<String>,

    /// format: date-time
    pub confirmation_sent_at: Option<String>,

    /// format: date-time
    pub recovery_sent_at: Option<String>,

    pub new_email: Option<String>,

    /// format: date-time
    pub email_change_sent_at: Option<String>,

    /// format: phone
    pub new_phone: Option<String>,

    /// format: date-time
    pub phone_change_sent_at: Option<String>,

    /// format: date-time
    pub reauthentication_sent_at: Option<String>,

    /// format: date-time
    pub last_sign_in_at: String,

    pub factors: Option<Vec<MFAFactorSchema>>,

    /// format: date-time
    pub banned_until: Option<String>,

    /// format: date-time
    pub created_at: String,

    /// format: date-time
    pub updated_at: String,

    /// format: date-time
    pub deleted_at: Option<String>,

    pub app_metadata: AppMetadata,
    // Not implemented:
    // user_metadata
    // identities
}

/// Represents a MFA factor.
#[derive(serde::Deserialize)]
pub struct MFAFactorSchema {
    /// format: uuid
    pub id: String,

    /// Usually one of:
    ///     - verified
    ///     - unverified
    pub status: String,

    pub friendly_name: String,

    /// Usually one of:
    ///     - totp
    pub factor_type: String,
}

#[derive(serde::Deserialize)]
pub struct AppMetadata {
    pub provider: String,
    pub providers: Vec<String>,
}

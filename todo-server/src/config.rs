use std::str::FromStr;

#[derive(Debug, Clone)]
pub struct Config {
    pub addr: std::net::IpAddr,
    pub port: u16,
    pub sb_url: String,
    pub sb_apikey: String,
    pub sb_jwt: String,
}

impl Config {
    pub fn init() -> Config {
        Config {
            addr: match std::env::var("HOSTNAME") {
                Ok(hostname) => {
                    std::net::IpAddr::V6(std::net::Ipv6Addr::from_str(&hostname).unwrap())
                }
                Err(_) => std::net::IpAddr::V6(std::net::Ipv6Addr::LOCALHOST),
            },
            port: match std::env::var("PORT") {
                Ok(p) => p.parse::<u16>().unwrap(),
                Err(_) => 8080,
            },
            sb_url: std::env::var("SUPABASE_URL").expect("SUPABASE_URL must be set"),
            sb_apikey: std::env::var("SUPABASE_API").expect("SUPABASE_API must be set"),
            sb_jwt: std::env::var("SUPABASE_JWT").expect("SUPABASE_JWT must be set"),
        }
    }
}

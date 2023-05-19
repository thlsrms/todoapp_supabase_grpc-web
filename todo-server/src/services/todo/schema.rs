// This module should be used to define serde structs based on the table structures being used.
// These sttructs will be used to parse the databse responses/requests from and into json.

/// Tasks table
pub mod tasks {
    use super::super::proto::todo::v1::Task;

    /// Struct to be used in a insert query
    #[derive(serde::Serialize)]
    pub struct InsertTask {
        pub author_id: String,
        pub title: String,
        pub description: Option<String>,
    }

    /// Used as result from a column filter query or optionally update fields
    #[derive(serde::Deserialize, serde::Serialize, Debug)]
    pub struct QueryTask {
        pub id: u32, // Unique identifier not nullable
        #[serde(skip_serializing_if = "Option::is_none")]
        pub author_id: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub title: Option<String>,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub completed: Option<bool>,
        #[serde(skip_serializing_if = "Option::is_none")]
        pub description: Option<String>,
    }

    impl QueryTask {
        pub fn into_task(&self) -> Task {
            Task {
                id: self.id,
                author_id: self.author_id.clone().unwrap_or_default(),
                title: self.title.clone().unwrap_or_default(),
                completed: self.completed.unwrap_or_default(),
                description: self.description.clone(),
            }
        }
    }
}

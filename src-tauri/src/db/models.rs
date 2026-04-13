use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Session {
    pub id: i64,
    pub start_time: i64,
    pub end_time: Option<i64>,
    pub average_score: f64,
    pub xp_earned: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Preference {
    pub key: String,
    pub value: String,
}

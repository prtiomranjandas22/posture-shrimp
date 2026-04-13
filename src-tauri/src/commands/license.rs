use tauri::command;
use serde::{Deserialize, Serialize};
use reqwest::Client;

#[derive(Serialize)]
pub struct LicenseRequest {
    pub email: String,
    pub license_key: String,
}

#[derive(Deserialize, Serialize)]
pub struct LicenseResponse {
    pub valid: bool,
    pub device_count: i32,
    pub error: Option<String>,
}

#[command]
pub async fn validate_license(email: String, license_key: String) -> Result<LicenseResponse, String> {
    // Mock API validation
    if license_key.starts_with("MOCK_") {
        return Ok(LicenseResponse {
            valid: true,
            device_count: 1,
            error: None,
        });
    }

    let client = Client::new();
    let res = client.post("https://api.postureshrimp.com/v1/license/validate")
        .json(&LicenseRequest { email, license_key })
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let license_data: LicenseResponse = res.json().await.map_err(|e| e.to_string())?;
    Ok(license_data)
}

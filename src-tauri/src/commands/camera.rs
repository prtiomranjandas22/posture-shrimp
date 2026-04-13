use tauri::command;

#[command]
pub fn get_camera_status() -> Result<bool, String> {
    // In a real implementation this might check OS-level camera hardware switches.
    // For now we assume the browser JS covers `navigator.mediaDevices.getUserMedia`.
    Ok(true)
}

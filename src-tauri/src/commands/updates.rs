use tauri::command;

#[command]
pub fn check_for_updates() -> Result<bool, String> {
    Ok(false)
}

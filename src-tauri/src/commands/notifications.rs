use tauri::command;
use notify_rust::Notification;

#[command]
pub fn send_slouch_alert(title: String, message: String) -> Result<(), String> {
    // Note: To truly respect OS DND without native plugin, notify_rust relies on default DBus/macOS/Windows behaviors
    // which mostly respect DND by default depending on the exact OS version.
    Notification::new()
        .summary(&title)
        .body(&message)
        .icon("dialog-warning")
        .timeout(notify_rust::Timeout::Milliseconds(5000))
        .show()
        .map_err(|e| e.to_string())?;
        
    Ok(())
}

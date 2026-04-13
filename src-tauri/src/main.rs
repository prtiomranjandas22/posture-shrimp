#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod db;
mod commands;

use db::queries::init_db;
use rusqlite::Connection;
use std::sync::Mutex;

pub struct AppState {
    pub db_conn: Mutex<Connection>,
}

fn main() {
    let conn = Connection::open_in_memory().expect("Failed to open DB");
    init_db(&conn).expect("Failed to initialize DB schema");

    tauri::Builder::default()
        .manage(AppState {
            db_conn: Mutex::new(conn),
        })
        .invoke_handler(tauri::generate_handler![
            commands::camera::get_camera_status,
            commands::notifications::send_slouch_alert,
            commands::license::validate_license,
            commands::updates::check_for_updates,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

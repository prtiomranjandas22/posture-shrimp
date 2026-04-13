use rusqlite::{params, Connection, Result};
use super::models::{Session, Preference};

pub fn init_db(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY,
            start_time INTEGER NOT NULL,
            end_time INTEGER,
            average_score REAL NOT NULL,
            xp_earned INTEGER NOT NULL
        )",
        [],
    )?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS preferences (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
        )",
        [],
    )?;

    Ok(())
}

pub fn insert_session(conn: &Connection, session: &Session) -> Result<i64> {
    conn.execute(
        "INSERT INTO sessions (start_time, average_score, xp_earned) VALUES (?1, ?2, ?3)",
        params![session.start_time, session.average_score, session.xp_earned],
    )?;
    Ok(conn.last_insert_rowid())
}

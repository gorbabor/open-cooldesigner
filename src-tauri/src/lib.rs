// Open-Cooldesigner — backend Tauri 2 (Rust).
//
// Fonctions système exposées au frontend via `invoke`:
//   - store_secret / get_secret / delete_secret : gestion sécurisée des clés API
//     via le Windows Credential Manager (crate keyring). Aucune clé en clair sur disque.
//   - app_data_dir : chemin du répertoire de données applicatives
//     (%APPDATA%/Open-Cooldesigner).

use serde::{Deserialize, Serialize};

const KEYRING_SERVICE: &str = "open-cooldesigner";

#[derive(Serialize, Deserialize)]
struct SecretPayload {
    key: String,
    value: String,
}

fn entry(key: &str) -> Result<keyring::Entry, String> {
    keyring::Entry::new(KEYRING_SERVICE, key).map_err(|e| format!("Credential Manager indisponible: {e}"))
}

#[tauri::command]
fn store_secret(_app: tauri::AppHandle, payload: SecretPayload) -> Result<(), String> {
    if payload.key.trim().is_empty() || payload.value.is_empty() {
        return Err("Clé ou valeur vide.".into());
    }
    let entry = entry(&payload.key)?;
    entry
        .set_password(&payload.value)
        .map_err(|e| format!("Écriture Credential Manager impossible: {e}"))
}

#[tauri::command]
fn get_secret(_app: tauri::AppHandle, key: String) -> Result<String, String> {
    let entry = entry(&key)?;
    entry
        .get_password()
        .map_err(|e| format!("Secret introuvable: {e}"))
}

#[tauri::command]
fn delete_secret(_app: tauri::AppHandle, key: String) -> Result<(), String> {
    let entry = entry(&key)?;
    entry
        .delete_credential()
        .map_err(|e| format!("Suppression impossible: {e}"))
}

#[tauri::command]
fn app_data_dir(app: tauri::AppHandle) -> Result<String, String> {
    app.path()
        .app_data_dir()
        .map(|p| p.to_string_lossy().into_owned())
        .map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            store_secret,
            get_secret,
            delete_secret,
            app_data_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

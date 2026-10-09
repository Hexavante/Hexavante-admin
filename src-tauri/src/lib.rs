use serde::Serialize;
use tauri::Manager;

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DesktopApiConfig {
    base_url: String,
    client: &'static str,
    version: &'static str,
}

#[tauri::command]
fn desktop_api_config() -> Result<DesktopApiConfig, String> {
    let base_url = std::env::var("DESKTOP_API_URL")
        .unwrap_or_else(|_| "https://desktop-api.hexavante.com.br".to_string());
    let parsed = base_url.trim_end_matches('/').to_string();
    if !(parsed.starts_with("https://") || cfg!(debug_assertions) && parsed.starts_with("http://localhost")) {
        return Err("DESKTOP_API_URL inválida".to_string());
    }
    Ok(DesktopApiConfig { base_url: parsed, client: "desktop", version: env!("CARGO_PKG_VERSION") })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![desktop_api_config])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();
            window.set_title("Hexavante").ok();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

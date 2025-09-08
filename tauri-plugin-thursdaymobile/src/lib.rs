use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::Thursdaymobile;
#[cfg(mobile)]
use mobile::Thursdaymobile;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the thursdaymobile APIs.
pub trait ThursdaymobileExt<R: Runtime> {
  fn thursdaymobile(&self) -> &Thursdaymobile<R>;
}

impl<R: Runtime, T: Manager<R>> crate::ThursdaymobileExt<R> for T {
  fn thursdaymobile(&self) -> &Thursdaymobile<R> {
    self.state::<Thursdaymobile<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("thursdaymobile")
    // .invoke_handler(tauri::generate_handler![commands::check_permissions, commands::request_permissions])
    .setup(|app, api| {
      #[cfg(mobile)]
      let thursdaymobile = mobile::init(app, api)?;
      #[cfg(desktop)]
      let thursdaymobile = desktop::init(app, api)?;
      app.manage(thursdaymobile);
      Ok(())
    })
    .build()
}

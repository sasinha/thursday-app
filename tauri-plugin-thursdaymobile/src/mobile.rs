// use serde::{de::DeserializeOwned, Serialize};
use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

#[cfg(target_os = "ios")]
tauri::ios_plugin_binding!(init_plugin_thursdaymobile);

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<Thursdaymobile<R>> {
  #[cfg(target_os = "android")]
  let handle = api.register_android_plugin("com.plugin.thursdaymobile", "ThursdayMobilePlugin")?;
  #[cfg(target_os = "ios")]
  let handle = api.register_ios_plugin(init_plugin_thursdaymobile)?;
  Ok(Thursdaymobile(handle))
}

/// Access to the thursdaymobile APIs.
pub struct Thursdaymobile<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> Thursdaymobile<R> {
  pub fn ping(&self, payload: PingRequest) -> crate::Result<PingResponse> {
    self
      .0
      .run_mobile_plugin("ping", payload)
      .map_err(Into::into)
  }
}


// impl<R: Runtime> Thursdaymobile<R> {
//   pub fn request_permissions(&self, permissions: Option<Vec<PermissionType>>) -> crate::Result<PermissionStatus> {
//     self
//       .0
//       .run_mobile_plugin("requestPermissions", serde_json::json!({ "permissions": permissions }),)
//       .map_err(Into::into)
//   }
// }

// impl<R: Runtime> Thursdaymobile<R> {
// pub fn check_permissions(&self, permissions: Option<Vec<PermissionType>>) -> crate::Result<PermissionStatus> {
//   self.0
//     .run_mobile_plugin("checkPermissions", ())
//     .map_err(Into::into)
// }
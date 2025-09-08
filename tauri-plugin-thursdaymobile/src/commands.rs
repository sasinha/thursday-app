use tauri::{AppHandle, command, Runtime};

use crate::models::*;
use crate::Result;
use crate::ThursdaymobileExt;

#[command]
pub(crate) async fn ping<R: Runtime>(
    app: AppHandle<R>,
    payload: PingRequest,
) -> Result<PingResponse> {
    app.thursdaymobile().ping(payload)
}


// #[command]
// pub(crate) async fn check_permissions<R: Runtime>(app: AppHandle<R>) -> Result<PermissionStatus> {
//     app.thursdaymobile().check_permissions()
// }

// #[command]
// pub(crate) async fn request_permissions<R: Runtime>(
//     app: AppHandle<R>,
//     permissions: Option<Vec<PermissionType>>,
// ) -> Result<PermissionStatus> {
//     app.thursdaymobile().request_permissions(permissions)
// }
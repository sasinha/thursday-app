package com.plugin.thursdaymobile

import android.Manifest
import app.tauri.annotation.TauriPlugin
import app.tauri.plugin.Plugin
import app.tauri.annotation.Permission
// import app.tauri.annotation.Command
import android.app.Activity
// import app.tauri.plugin.Invoke


// Currently only needs mic
@TauriPlugin(
  permissions = [
    Permission(strings = [Manifest.permission.RECORD_AUDIO, Manifest.permission.MODIFY_AUDIO_SETTINGS], alias="mic")
  ]
)
class ThursdayMobilePlugin(activity: Activity) : Plugin(activity) {
  // @Command
  // override fun checkPermissions(invoke: Invoke) {
  //   super.checkPermissions(invoke)
  // }

  // @Command
  // override fun requestPermissions(invoke: Invoke) {
  //   super.requestPermissions(invoke)
  // }
}

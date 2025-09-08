import { invoke, isTauri } from '@tauri-apps/api/core'
import {checkPermissions, requestPermissions} from 'thursdaymobile-api'

export async function getMic() {
	if (isTauri()) {
		console.log("In tauri")
		let permissionStatus = await checkPermissions();
		console.log("PermissionStatus", {permissionStatus})
		if (permissionStatus.startsWith('prompt')) {
		  permissionStatus = await requestPermissions();
		}
		if (permissionStatus === 'denied') {
		  	console.log("Mic Permissions were denied")
		  	return null
		}
	}

	return await navigator.mediaDevices.getUserMedia({
      audio: true
    })
}
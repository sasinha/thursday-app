import {
  invoke,
  requestPermissions as requestPermissions_,
  checkPermissions as checkPermissions_
} from '@tauri-apps/api/core'
export type { PermissionState } from '@tauri-apps/api/core'

export async function ping(value: string): Promise<string | null> {
  return await invoke<{value?: string}>('plugin:thursdaymobile|ping', {
    payload: {
      value,
    },
  }).then((r) => (r.value ? r.value : null));
}

/**
 * Get permission state.
 */
export async function checkPermissions(): Promise<PermissionState> {
  return await checkPermissions_<{ mic: PermissionState }>(
    'thursdaymobile'
  ).then((r) => r.mic)
}

/**
 * Request permissions to use the mic.
 */
export async function requestPermissions(): Promise<PermissionState> {
  return await requestPermissions_<{ mic: PermissionState }>(
    'thursdaymobile'
  ).then((r) => r.mic)
}

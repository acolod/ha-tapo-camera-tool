import type { AppState } from '../types';

export const initialState: AppState = {
  cameraFriendlyName: '',
  cameraEntityId: '', // <-- ADD THIS LINE
  entities: [],
  rawEntityText: '',
  isProcessed: false,
  packageYaml: '',
  lovelaceYaml: '',
  automationYaml: '',
};
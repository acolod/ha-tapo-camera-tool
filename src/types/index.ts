// Defines the structure for a single Home Assistant entity
export interface HAEntity {
  id: string; // e.g., "switch.driveway_cam_a_c402_privacy"
  type: 'switch' | 'select' | 'number' | 'sensor' | 'camera' | 'unknown';
  // The user-friendly part of the name, e.g., "privacy_mode"
  nameSuffix: string; 
  attributes: {
    options?: string[];
    min?: number;
    max?: number;
    step?: number;
    state?: string; // <-- ADD THIS LINE
  };
  selected: boolean; // Is it checked in the list?
}

// Defines the structure for our application's entire state
export interface AppState {
  cameraFriendlyName: string;
  cameraEntityId: string; 
  entities: HAEntity[];
  rawEntityText: string;
  isProcessed: boolean;
  packageYaml: string;
  lovelaceYaml: string;
  automationYaml: string;
}

// Defines the actions we can take to change the state
export type Action =
  | { type: 'SET_CAMERA_NAME'; payload: string }
  | { type: 'SET_CAMERA_ENTITY_ID'; payload: string }
  | { type: 'SET_RAW_ENTITY_TEXT'; payload: string }
  | { type: 'PROCESS_ENTITIES'; payload: HAEntity[] }
  | { type: 'TOGGLE_ENTITY_SELECTED'; payload: string } // payload is entity id
  | { type: 'REORDER_ENTITIES'; payload: HAEntity[] }
  | { type: 'GENERATE_PACKAGE'; payload: string }
  | { type: 'GENERATE_LOVELACE'; payload: string }
  | { type: 'GENERATE_AUTOMATION'; payload: string }
  | { type: 'RESET_STATE' };
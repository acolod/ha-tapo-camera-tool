import type { AppState, Action } from '../types';
import { initialState } from './initialState';

export const AppReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'SET_CAMERA_NAME':
      return { ...state, cameraFriendlyName: action.payload };
    case 'SET_CAMERA_ENTITY_ID': // <-- ADD THIS CASE BLOCK
      return { ...state, cameraEntityId: action.payload };
    case 'SET_RAW_ENTITY_TEXT':
      return { ...state, rawEntityText: action.payload };
    case 'PROCESS_ENTITIES':
      return { ...state, entities: action.payload, isProcessed: true };
    case 'TOGGLE_ENTITY_SELECTED':
      return {
        ...state,
        entities: state.entities.map((entity) =>
          entity.id === action.payload
            ? { ...entity, selected: !entity.selected }
            : entity
        ),
      };
    case 'REORDER_ENTITIES':
      return { ...state, entities: action.payload };
    case 'GENERATE_PACKAGE':
      return { ...state, packageYaml: action.payload };
    case 'GENERATE_LOVELACE':
      return { ...state, lovelaceYaml: action.payload };
    case 'GENERATE_AUTOMATION':
      return { ...state, automationYaml: action.payload };
    case 'RESET_STATE':
        return {
            ...initialState,
            rawEntityText: state.rawEntityText, 
            cameraFriendlyName: state.cameraFriendlyName,
            cameraEntityId: state.cameraEntityId, // <-- ADD THIS LINE
        };
    default:
      return state;
  }
};
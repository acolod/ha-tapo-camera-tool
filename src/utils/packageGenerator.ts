import type { HAEntity } from '../types';

// Map of keywords to MDI icons
const ICON_MAP: Record<string, string> = {
  privacy: 'mdi:eye-off',
  notification: 'mdi:bell',
  led: 'mdi:led-on',
  flip: 'mdi:flip-horizontal',
  audio: 'mdi:microphone',
  record: 'mdi:record-rec',
  microphone: 'mdi:microphone',
  speaker: 'mdi:speaker',
  distortion: 'mdi:camera-iris',
  sd_card: 'mdi:sd',
  mute: 'mdi:microphone-off',
  noise_cancellation: 'mdi:noise-cancelling-headphones',
  motion: 'mdi:motion-sensor',
  person: 'mdi:human',
  vehicle: 'mdi:car',
  pet: 'mdi:dog',
  alarm: 'mdi:alarm-light',
  night_vision: 'mdi:weather-night',
  siren: 'mdi:alarm',
  spotlight: 'mdi:spotlight',
  timezone: 'mdi:map-clock',
  frequency: 'mdi:sine-wave',
  firmware: 'mdi:chip',
  sync: 'mdi:sync',
};

// Function to find the best icon for an entity name
const getIconForEntity = (nameSuffix: string): string | null => {
  const lowerName = nameSuffix.toLowerCase();
  for (const keyword in ICON_MAP) {
    if (lowerName.includes(keyword)) {
      return ICON_MAP[keyword];
    }
  }
  return null;
};


export function generatePackageYaml(entities: HAEntity[], friendlyName: string, entityId: string): string {
  const selectedEntities = entities.filter(e => e.selected && (e.type === 'switch' || e.type === 'number' || e.type === 'select'));
  const baseName = entityId;

  const inputBooleans = selectedEntities.filter(e => e.type === 'switch');
  const inputNumbers = selectedEntities.filter(e => e.type === 'number');
  const inputSelects = selectedEntities.filter(e => e.type === 'select');
  
  const toTitleCase = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  let yaml = `# Package for ${friendlyName}\n`;
  
  if (inputBooleans.length > 0) {
    yaml += 'input_boolean:\n';
    inputBooleans.forEach(e => {
      const icon = getIconForEntity(e.nameSuffix);
      const iconLine = icon ? `    icon: ${icon}\n` : '';
      yaml += `  ${baseName}_home_${e.nameSuffix}:\n    name: ${friendlyName} [HOME] ${toTitleCase(e.nameSuffix)}\n${iconLine}`;
      yaml += `  ${baseName}_away_${e.nameSuffix}:\n    name: ${friendlyName} [AWAY] ${toTitleCase(e.nameSuffix)}\n${iconLine}`;
    });
  }

  if (inputNumbers.length > 0) {
    yaml += '\ninput_number:\n';
    inputNumbers.forEach(e => {
      const icon = getIconForEntity(e.nameSuffix);
      const iconLine = icon ? `    icon: ${icon}\n` : '';
      yaml += `  ${baseName}_home_${e.nameSuffix}:\n    name: ${friendlyName} [HOME] ${toTitleCase(e.nameSuffix)}\n${iconLine}    min: ${e.attributes.min}\n    max: ${e.attributes.max}\n    step: ${e.attributes.step}\n`;
      yaml += `  ${baseName}_away_${e.nameSuffix}:\n    name: ${friendlyName} [AWAY] ${toTitleCase(e.nameSuffix)}\n${iconLine}    min: ${e.attributes.min}\n    max: ${e.attributes.max}\n    step: ${e.attributes.step}\n`;
    });
  }

  if (inputSelects.length > 0) {
    yaml += '\ninput_select:\n';
    inputSelects.forEach(e => {
      const icon = getIconForEntity(e.nameSuffix);
      const iconLine = icon ? `    icon: ${icon}\n` : '';
      const options = JSON.stringify(e.attributes.options || []);
      yaml += `  ${baseName}_home_${e.nameSuffix}:\n    name: ${friendlyName} [HOME] ${toTitleCase(e.nameSuffix)}\n${iconLine}    options: ${options}\n`;
      yaml += `  ${baseName}_away_${e.nameSuffix}:\n    name: ${friendlyName} [AWAY] ${toTitleCase(e.nameSuffix)}\n${iconLine}    options: ${options}\n`;
    });
  }

  return yaml;
}
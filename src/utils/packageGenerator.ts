import type { HAEntity } from '../types';

export function generatePackageYaml(entities: HAEntity[], friendlyName: string, entityId: string): string {
  const selectedEntities = entities.filter(e => e.selected);
  const baseName = entityId;

  const inputBooleans = selectedEntities.filter(e => e.type === 'switch');
  const inputNumbers = selectedEntities.filter(e => e.type === 'number');
  const inputSelects = selectedEntities.filter(e => e.type === 'select');
  
  const toTitleCase = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  let yaml = `# Package for ${friendlyName}\n`;
  
  if (inputBooleans.length > 0) {
    yaml += 'input_boolean:\n';
    inputBooleans.forEach(e => {
      // UPDATED NAME LOGIC
      yaml += `  ${baseName}_home_${e.nameSuffix}:\n    name: ${friendlyName} [HOME] ${toTitleCase(e.nameSuffix)}\n`;
      yaml += `  ${baseName}_away_${e.nameSuffix}:\n    name: ${friendlyName} [AWAY] ${toTitleCase(e.nameSuffix)}\n`;
    });
  }

  if (inputNumbers.length > 0) {
    yaml += '\ninput_number:\n';
    inputNumbers.forEach(e => {
      // UPDATED NAME LOGIC
      yaml += `  ${baseName}_home_${e.nameSuffix}:\n    name: ${friendlyName} [HOME] ${toTitleCase(e.nameSuffix)}\n    min: ${e.attributes.min}\n    max: ${e.attributes.max}\n    step: ${e.attributes.step}\n`;
      yaml += `  ${baseName}_away_${e.nameSuffix}:\n    name: ${friendlyName} [AWAY] ${toTitleCase(e.nameSuffix)}\n    min: ${e.attributes.min}\n    max: ${e.attributes.max}\n    step: ${e.attributes.step}\n`;
    });
  }

  if (inputSelects.length > 0) {
    yaml += '\ninput_select:\n';
    inputSelects.forEach(e => {
      const options = JSON.stringify(e.attributes.options || []);
      // UPDATED NAME LOGIC
      yaml += `  ${baseName}_home_${e.nameSuffix}:\n    name: ${friendlyName} [HOME] ${toTitleCase(e.nameSuffix)}\n    options: ${options}\n`;
      yaml += `  ${baseName}_away_${e.nameSuffix}:\n    name: ${friendlyName} [AWAY] ${toTitleCase(e.nameSuffix)}\n    options: ${options}\n`;
    });
  }

  return yaml;
}
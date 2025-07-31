import type { HAEntity } from '../types';

// Define the categories and the keywords to identify them. Order matters.
const CATEGORIES = [
  { name: 'General & Privacy', keywords: ['privacy', 'indicator_led', 'flip'] },
  { name: 'Notifications', keywords: ['notification'] },
  { name: 'Recording & Audio', keywords: ['record', 'audio', 'microphone', 'speaker', 'lens_distortion'] },
  { name: 'Detection Settings', keywords: ['detection', 'person', 'vehicle', 'pet'] },
  { name: 'Vision & Alarm', keywords: ['night_vision', 'alarm'] },
  { name: 'Siren', keywords: ['siren'] },
  { name: 'Spotlight', keywords: ['spotlight'] },
  { name: 'Advanced', keywords: ['timezone', 'frequency', 'firmware', 'diagnose', 'sync'] },
];

export function generateLovelaceYaml(entities: HAEntity[], friendlyName: string, entityId: string): string {
  // --- THIS LINE IS NOW FIXED to ignore sensor/camera entities ---
  const selectedEntities = entities.filter(e => e.selected && (e.type === 'switch' || e.type === 'number' || e.type === 'select'));
  const baseName = entityId;

  const buildEntitiesForMode = (mode: 'home' | 'away'): string => {
    let categoryString = '';
    const unmappedEntities: HAEntity[] = [...selectedEntities];

    CATEGORIES.forEach(category => {
      // --- THIS LOGIC IS NOW FIXED to prevent duplicates ---
      const categoryEntities = unmappedEntities.filter(e => 
        category.keywords.some(keyword => e.nameSuffix.toLowerCase().includes(keyword))
      );

      if (categoryEntities.length > 0) {
        categoryString += `- type: section\n  label: ${category.name}\n`;
        categoryEntities.forEach(e => {
          const helperType = e.type === 'switch' ? 'input_boolean' : e.type === 'number' ? 'input_number' : 'input_select';
          categoryString += `- entity: ${helperType}.${baseName}_${mode}_${e.nameSuffix}\n`;
          
          // Remove the entity from the unmapped list so it can't be used again
          const index = unmappedEntities.findIndex(um => um.id === e.id);
          if (index > -1) unmappedEntities.splice(index, 1);
        });
      }
    });

    if (unmappedEntities.length > 0) {
      categoryString += `- type: section\n  label: Other\n`;
      unmappedEntities.forEach(e => {
        const helperType = e.type === 'switch' ? 'input_boolean' : e.type === 'number' ? 'input_number' : 'input_select';
        categoryString += `- entity: ${helperType}.${baseName}_${mode}_${e.nameSuffix}\n`;
      });
    }

    // Add the correct indentation (6 spaces) to every line before returning.
    return categoryString.trim().split('\n').map(line => `      ${line}`).join('\n');
  };

  const homeEntities = buildEntitiesForMode('home');
  const awayEntities = buildEntitiesForMode('away');

  const yaml = `
type: entities
title: ${friendlyName} Settings
state_color: true
entities:
  - type: custom:fold-entity-row
    head:
      type: section
      label: Home Settings
    padding: 20
    entities:
${homeEntities}
  - type: custom:button-card
    color_type: blank-card
    styles:
      card:
        - height: 3px
  - type: custom:fold-entity-row
    head:
      type: section
      label: Away Settings
    padding: 20
    entities:
${awayEntities}
`.trim();

  return yaml;
}
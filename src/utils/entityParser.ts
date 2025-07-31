import type { HAEntity } from '../types';

export function parseHaOutput(rawText: string, cameraEntityId: string): HAEntity[] {
  const entities: HAEntity[] = []; // <-- This line is now fixed
  const lines = rawText.split('\n');

  const entityIdRegex = /-\s*`((?:switch|select|number|sensor|camera)\.[^`]+)`(?:\s*—\s*state:\s*\*\*(.+?)\*\*|.*)/;
  const optionsRegex = /-\s*\*\*Options:\*\*\s*`(.+?)`/;
  const minRegex = /-\s*\*\*Min:\*\*\s*`(.+?)`/;
  const maxRegex = /-\s*\*\*Max:\*\*\s*`(.+?)`/;
  const stepRegex = /-\s*\*\*Step:\*\*\s*`(.+?)`/;

  let lastEntity: Partial<HAEntity> & { attributes: Partial<HAEntity['attributes']> } = { attributes: {} };

  for (const line of lines) {
    const trimmedLine = line.trim();
    const entityMatch = trimmedLine.match(entityIdRegex);

    if (entityMatch) {
      if (lastEntity.id) {
        entities.push(lastEntity as HAEntity);
      }

      const id = entityMatch[1];
      const state = entityMatch[2];
      const type = id.split('.')[0] as HAEntity['type'];
      
      const nameSuffix = id.replace(`${type}.${cameraEntityId}_`, '');

      lastEntity = {
        id,
        type,
        nameSuffix,
        attributes: {},
        selected: true,
      };
      
      if (state && lastEntity.attributes) {
        lastEntity.attributes.state = state;
      }

    } else if (lastEntity.id) {
      const optionsMatch = trimmedLine.match(optionsRegex);
      if (optionsMatch && lastEntity.attributes) {
        try {
            lastEntity.attributes.options = JSON.parse(optionsMatch[1].replace(/'/g, '"'));
        } catch (e) {
            console.warn(`Could not parse options for ${lastEntity.id}: ${optionsMatch[1]}`);
            lastEntity.attributes.options = [optionsMatch[1]];
        }
      }

      const minMatch = trimmedLine.match(minRegex);
      if (minMatch && lastEntity.attributes) {
        lastEntity.attributes.min = parseFloat(minMatch[1]);
      }

      const maxMatch = trimmedLine.match(maxRegex);
      if (maxMatch && lastEntity.attributes) {
        lastEntity.attributes.max = parseFloat(maxMatch[1]);
      }
      
      const stepMatch = trimmedLine.match(stepRegex);
      if (stepMatch && lastEntity.attributes) {
        lastEntity.attributes.step = parseFloat(stepMatch[1]);
      }
    }
  }

  if (lastEntity.id) {
    entities.push(lastEntity as HAEntity);
  }

  return entities;
}
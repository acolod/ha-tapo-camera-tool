import type { HAEntity } from '../types';

export function generateAutomationYaml(entities: HAEntity[], friendlyName: string, entityId: string): string {
  const selectedEntities = entities.filter(e => e.selected && (e.type === 'switch' || e.type === 'select' || e.type === 'number'));
  const baseName = entityId;

  let sequence = '';

  selectedEntities.forEach(e => {
    const helperType = e.type === 'switch' ? 'input_boolean' : e.type === 'number' ? 'input_number' : 'input_select';
    
    switch(e.type) {
      case 'switch':
        // --- THIS BLOCK IS NOW FIXED to use the safer is_state() template ---
        sequence += `
              - if:
                  - condition: template
                    value_template: "{{ states('${e.id}') != states('${helperType}.${baseName}_' ~ mode ~ '_${e.nameSuffix}') }}"
                then:
                  - service: "switch.turn_{{ 'on' if is_state('${helperType}.${baseName}_' ~ mode ~ '_${e.nameSuffix}', 'on') else 'off' }}"
                    target:
                      entity_id: "${e.id}"
                  - delay: "00:00:02"`;
        break;
      case 'select':
        sequence += `
              - if:
                  - condition: template
                    value_template: "{{ states('${e.id}') != states('${helperType}.${baseName}_' ~ mode ~ '_${e.nameSuffix}') }}"
                then:
                  - service: select.select_option
                    target:
                      entity_id: "${e.id}"
                    data:
                      option: "{{ states('${helperType}.${baseName}_' ~ mode ~ '_${e.nameSuffix}') }}"
                  - delay: "00:00:02"`;
        break;
      case 'number':
        sequence += `
              - if:
                  - condition: template
                    value_template: "{{ states('${e.id}') | int != states('${helperType}.${baseName}_' ~ mode ~ '_${e.nameSuffix}') | int }}"
                then:
                  - service: number.set_value
                    target:
                      entity_id: "${e.id}"
                    data:
                      value: "{{ states('${helperType}.${baseName}_' ~ mode ~ '_${e.nameSuffix}') }}"
                  - delay: "00:00:02"`;
        break;
    }
  });

  const yaml = `
alias: "Camera Control: Apply ${friendlyName} Settings"
description: "Applies all stored Home/Away settings to the ${friendlyName}"
id: camera_control_apply_${baseName}_settings
trigger:
  - platform: state
    entity_id: input_select.security_mode
action:
  - variables:
      mode: "{{ 'home' if is_state('input_select.security_mode', 'Home') else 'away' }}"
      cam_name: "${baseName}"
  - choose:
      - conditions:
          - condition: template
            value_template: "{{ states('sensor.${baseName}_battery') not in ['unknown','unavailable'] }}"
        sequence:
${sequence}
mode: restart
`.trim();

  return yaml;
}
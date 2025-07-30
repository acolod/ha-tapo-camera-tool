import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { parseHaOutput } from '../utils/entityParser'; // <-- IMPORT THE PARSER

// This is the updated, more complete Jinja2 template.
const JINJA_TEMPLATE = `
## 📷 {{ name }}
---
### 🧲 Select Entities:
{% for e in states.select if e.entity_id.startswith('select.' ~ name) %}
- \`{{ e.entity_id }}\`
- **Options:** \`{{ e.attributes.options }}\`
{% else %}
- (none found)
{% endfor %}

### 🎚️ Number Entities:
{% for e in states.number if e.entity_id.startswith('number.' ~ name) %}
- \`{{ e.entity_id }}\`
- **Min:** \`{{ e.attributes.min }}\`
- **Max:** \`{{ e.attributes.max }}\`
- **Step:** \`{{ e.attributes.step }}\`
{% else %}
- (none found)
{% endfor %}

### 🔘 Switch Entities:
{% for e in states.switch if e.entity_id.startswith('switch.' ~ name) %}
- \`{{ e.entity_id }}\`
{% else %}
- (none found)
{% endfor %}

### 🔍 Sensor Entities:
{% for e in states.sensor if e.entity_id.startswith('sensor.' ~ name) %}
- \`{{ e.entity_id }}\`
{% else %}
- (none found)
{% endfor %}

### 📺 Camera Stream Entities:
{% for e in states.camera if e.entity_id.startswith('camera.' ~ name) %}
- \`{{ e.entity_id }}\` — state: **{{ e.state }}**
{% else %}
- (none found)
{% endfor %}
---
`.trim();

export function EntityInput() {
  const { state, dispatch } = useContext(AppContext);
  const [showTemplate, setShowTemplate] = React.useState(false);

  // --- UPDATE THIS FUNCTION ---
  const handleProcessClick = () => {
    try {
      const parsedEntities = parseHaOutput(state.rawEntityText, state.cameraEntityId);
      dispatch({ type: 'PROCESS_ENTITIES', payload: parsedEntities });
      console.log("Processed Entities:", parsedEntities);
    } catch (error) {
        alert("An error occurred while parsing the entity text. Please ensure it is copied correctly from the HA template editor.");
        console.error("Parsing Error:", error);
    }
  };
  
  const finalJinjaTemplate = `{% set name = '${state.cameraEntityId || 'YOUR_CAMERA_ENTITY_ID_HERE'}' %}\n${JINJA_TEMPLATE}`;

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Step 1: Provide Camera Details</h2>
        <p className="text-gray-600 mt-1">
          Enter a friendly name, the base entity ID, and then paste the entity list from Home Assistant.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera Name Input */}
        <div>
          <label htmlFor="cameraName" className="block text-sm font-medium text-gray-700 mb-1">
            Camera Friendly Name
          </label>
          <input
            type="text"
            id="cameraName"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Driveway Cam A"
            value={state.cameraFriendlyName}
            onChange={(e) => dispatch({ type: 'SET_CAMERA_NAME', payload: e.target.value })}
          />
        </div>
        
        {/* Camera Entity ID Input */}
        <div>
          <label htmlFor="cameraEntityId" className="block text-sm font-medium text-gray-700 mb-1">
            Camera Base Entity ID
          </label>
          <input
            type="text"
            id="cameraEntityId"
            className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., driveway_cam_a_c402"
            value={state.cameraEntityId}
            onChange={(e) => dispatch({ type: 'SET_CAMERA_ENTITY_ID', payload: e.target.value })}
          />
        </div>
      </div>

      {/* Jinja Template Button */}
      <div className="pt-2">
          <button
            onClick={() => setShowTemplate(!showTemplate)}
            className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showTemplate ? 'Hide' : 'Show'} Jinja2 Template for HA
          </button>
        </div>

      {/* Collapsible Jinja Template Area */}
      {showTemplate && (
        <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
          <p className="text-gray-300 mb-2">
            The entity ID you entered has been added to the template. Copy this into Home Assistant's Developer Tools &gt; Template editor.
          </p>
          <textarea
            readOnly
            className="w-full h-64 bg-gray-900 text-gray-200 border border-gray-600 rounded-md p-2 resize-none"
            value={finalJinjaTemplate}
          />
        </div>
      )}

      {/* HA Output Text Area */}
      <div>
        <label htmlFor="haOutput" className="block text-sm font-medium text-gray-700 mb-1">
          Paste Home Assistant Template Output
        </label>
        <textarea
          id="haOutput"
          rows={10}
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-mono text-xs"
          placeholder="Paste the full entity list from HA Developer Tools here..."
          value={state.rawEntityText}
          onChange={(e) => dispatch({ type: 'SET_RAW_ENTITY_TEXT', payload: e.target.value })}
        />
      </div>

      {/* Process Button */}
      <div className="text-right">
        <button
          onClick={handleProcessClick}
          disabled={!state.cameraFriendlyName || !state.rawEntityText || !state.cameraEntityId}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Process Entities
        </button>
      </div>
    </div>
  );
}
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { generatePackageYaml } from '../utils/packageGenerator';
import { generateLovelaceYaml } from '../utils/cardGenerator';
import { generateAutomationYaml } from '../utils/automationGenerator';
import type { HAEntity } from '../types';

const ENTITY_TYPE_ORDER: HAEntity['type'][] = ['switch', 'select', 'number', 'sensor', 'camera'];
const ENTITY_TYPE_NAMES: Record<HAEntity['type'], string> = {
  switch: 'Switches (Toggles)',
  select: 'Selects (Dropdowns)',
  number: 'Numbers (Sliders)',
  sensor: 'Sensors',
  camera: 'Camera Streams',
  unknown: 'Unknown',
};

export function EntityList() {
  const { state, dispatch } = useContext(AppContext);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = state.entities.findIndex((e) => e.id === active.id);
      const newIndex = state.entities.findIndex((e) => e.id === over.id);
      const reorderedEntities = arrayMove(state.entities, oldIndex, newIndex);
      dispatch({ type: 'REORDER_ENTITIES', payload: reorderedEntities });
    }
  };

  const handleToggle = (id: string) => {
    dispatch({ type: 'TOGGLE_ENTITY_SELECTED', payload: id });
  };
  
  const handleGenerate = () => {
    const { entities, cameraFriendlyName, cameraEntityId } = state;
    const packageYaml = generatePackageYaml(entities, cameraFriendlyName, cameraEntityId);
    const lovelaceYaml = generateLovelaceYaml(entities, cameraFriendlyName, cameraEntityId);
    const automationYaml = generateAutomationYaml(entities, cameraFriendlyName, cameraEntityId);

    dispatch({ type: 'GENERATE_PACKAGE', payload: packageYaml });
    dispatch({ type: 'GENERATE_LOVELACE', payload: lovelaceYaml });
    dispatch({ type: 'GENERATE_AUTOMATION', payload: automationYaml });
  };
  
  // Group entities by type
  const groupedEntities = state.entities.reduce((acc, entity) => {
    (acc[entity.type] = acc[entity.type] || []).push(entity);
    return acc;
  }, {} as Record<HAEntity['type'], HAEntity[]>);

  return (
    <div className="p-8 bg-white rounded-lg shadow-md space-y-6">
       <div>
        <h2 className="text-xl font-semibold text-gray-800">Step 2: Customize Your Entities</h2>
        <p className="text-gray-600 mt-1">
          Uncheck any entities you don't want to include. Drag and drop to reorder within each section.
        </p>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={state.entities.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {ENTITY_TYPE_ORDER.map(type => (
              groupedEntities[type] && (
                <div key={type}>
                  <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-3">{ENTITY_TYPE_NAMES[type]}</h3>
                  <ul className="space-y-2">
                    {groupedEntities[type].map((entity) => (
                      <SortableItem key={entity.id} entity={entity} onToggle={handleToggle} />
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="pt-4 border-t border-gray-200 text-right">
        <button
          onClick={handleGenerate}
          className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Generate All Files
        </button>
      </div>
    </div>
  );
}
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { HAEntity } from '../types';

interface SortableItemProps {
  entity: HAEntity;
  onToggle: (id: string) => void;
}

// Helper to create a title-cased friendly name
const toTitleCase = (str: string) => str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

// Component to render extra details based on entity type
const EntityDetails = ({ entity }: { entity: HAEntity }) => {
    switch(entity.type) {
        case 'select':
            return <div className="text-xs text-gray-500 mt-1">Options: {entity.attributes.options?.join(', ') || 'N/A'}</div>;
        case 'number':
            return <div className="text-xs text-gray-500 mt-1">Range: {entity.attributes.min} to {entity.attributes.max} (Step: {entity.attributes.step})</div>;
        case 'sensor':
        case 'camera':
             return <div className="text-xs text-gray-500 mt-1">State: <span className="font-semibold">{entity.attributes.state || 'N/A'}</span></div>;
        default:
            return null;
    }
};


export function SortableItem({ entity, onToggle }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: entity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const friendlyName = toTitleCase(entity.nameSuffix);

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="p-3 bg-white border border-gray-200 rounded-md shadow-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Drag Handle */}
          <button 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 self-start pt-1"
            aria-label="Drag to reorder"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Checkbox and Label */}
          <div>
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id={entity.id}
                    checked={entity.selected}
                    onChange={() => onToggle(entity.id)}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor={entity.id} className="ml-3 font-medium text-sm text-gray-800">
                    {friendlyName}
                </label>
            </div>
            <div className="pl-7">
                <EntityDetails entity={entity} />
                <div className="font-mono text-xs text-gray-400 mt-1">{entity.id}</div>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
import React from 'react';

export type FilterType = 'all' | 'loved';

interface FilterControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onUndo: () => void;
  canUndo: boolean;
  totalSorted: number;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  currentFilter,
  onFilterChange,
  onUndo,
  canUndo,
  totalSorted
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      <div className="flex bg-muted rounded-lg p-1">
        <button
          onClick={() => onFilterChange('all')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentFilter === 'all' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          All ({totalSorted})
        </button>
        <button
          onClick={() => onFilterChange('loved')}
          className={`px-3 py-1.5 rounded-md text-sm font-medium ${currentFilter === 'loved' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
          Loved Only
        </button>
      </div>

      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md disabled:opacity-50 ml-auto">
        Undo
      </button>
    </div>
  );
};
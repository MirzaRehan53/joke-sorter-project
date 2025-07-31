import React from 'react';

interface DropZoneProps {
  type: 'loved' | 'not-funny';
  isActive: boolean;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  count: number;
}

export const DropZone: React.FC<DropZoneProps> = ({
  type,
  isActive,
  onDrop,
  onDragOver,
  onDragLeave,
  count
}) => {
  const config = {
    loved: {
      title: 'Loved It!',
      icon: '❤️'
    },
    'not-funny': {
      title: 'Not Funny',
      icon: '👎'
    }
  };

  const { title, icon } = config[type];

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className={`h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors 
        ${isActive ? `border-solid bg-${type === 'loved' ? 'loved-zone-light' : 'not-funny-zone-light'}` : 'border-border'}`}>
      <span className="text-2xl">{icon}</span>
      <div className="text-center">
        <h3 className={`font-medium text-sm text-${type === 'loved' ? 'loved-zone' : 'not-funny-zone'}`}>
          {title}
        </h3>
        {count > 0 && (
          <span className="text-xs text-muted-foreground">({count})</span>
        )}
      </div>
    </div>
  );
};
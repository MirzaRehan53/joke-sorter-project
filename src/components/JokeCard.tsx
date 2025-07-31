import React, { useEffect, useState } from 'react';

export interface Joke {
  id: string;
  joke: string;
  reaction?: 'loved' | 'not-funny';
  timeShown: number;
  startTime: number;
}

interface JokeCardProps {
  joke: Joke;
  onDragStart: (e: React.DragEvent, joke: Joke) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isDragging: boolean;
}

export const JokeCard: React.FC<JokeCardProps> = ({ joke, onDragStart, onDragEnd, isDragging }) => {
  const [timeDisplayed, setTimeDisplayed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDisplayed(Math.floor((Date.now() - joke.startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [joke.startTime]);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, joke)}
      onDragEnd={onDragEnd}
      className={`bg-card border rounded-lg p-4 cursor-grab hover:border-primary/50 transition-colors ${isDragging ? 'opacity-50' : ''}`}>
      <div className="text-xs text-muted-foreground mb-2">{timeDisplayed}s</div>
      <p className="text-card-foreground">{joke.joke}</p>
    </div>
  );
};
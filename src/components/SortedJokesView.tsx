import React from 'react';
import { Joke } from './JokeCard';

interface SortedJokesViewProps {
  jokes: Joke[];
  filter: 'all' | 'loved';
}

export const SortedJokesView: React.FC<SortedJokesViewProps> = ({ jokes, filter }) => {
  const filteredJokes = filter === 'loved' 
    ? jokes.filter(joke => joke.reaction === 'loved')
    : jokes;

  if (filteredJokes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold mb-2">
          {filter === 'loved' ? 'No loved jokes yet' : 'No sorted jokes yet'}
        </h3>
        <p className="text-muted-foreground">
          {filter === 'loved' 
            ? 'Start dragging jokes to the "Loved It" zone!'
            : 'Start sorting jokes by dragging them to the drop zones!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Showing {filteredJokes.length} {filter === 'loved' ? 'loved' : 'sorted'} joke{filteredJokes.length !== 1 ? 's' : ''}</p>
      
      <div className="space-y-4">
        {filteredJokes.map((joke) => (
          <div key={joke.id} className={`bg-card border rounded-lg p-4 flex items-start gap-4 ${joke.reaction === 'loved' ? 'border-loved-zone' : 'border-not-funny-zone'}`}>
            <div className={`text-2xl ${joke.reaction === 'loved' ? 'text-loved-zone' : 'text-not-funny-zone'}`}>
              {joke.reaction === 'loved' ? '❤️' : '👎'}
            </div>
            <div className="flex-1">
              <p className="text-card-foreground">{joke.joke}</p>
              <div className="text-xs text-muted-foreground mt-2">
                <span>Viewed for {joke.timeShown}s</span>
                <span className="mx-2">|</span>
                <span>{joke.reaction === 'loved' ? 'Loved' : 'Not Funny'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
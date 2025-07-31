import React, { useState, useEffect, useCallback } from 'react';
import { JokeCard, Joke } from './JokeCard';
import { DropZone } from './DropZone';
import { FilterControls, FilterType } from './FilterControls';
import { SortedJokesView } from './SortedJokesView';
import { ThemeToggle } from './ThemeToggle';

interface JokeResponse {
  id: string;
  joke: string;
}

const STORAGE_KEY = 'joke-sorter-data';

export const JokeSorter: React.FC = () => {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [sortedJokes, setSortedJokes] = useState<Joke[]>([]);
  const [lastSortedJoke, setLastSortedJoke] = useState<Joke | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedJoke, setDraggedJoke] = useState<Joke | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<'loved' | 'not-funny' | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSortedJokes(data.sortedJokes || []);
      } catch (error) {
        console.error('Failed to load saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const data = { sortedJokes };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [sortedJokes]);

  const fetchJokes = useCallback(async () => {
    setIsLoading(true);
    try {
      const jokePromises = Array.from({ length: 5 }, async () => {
        const response = await fetch('https://icanhazdadjoke.com/', {
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch joke');
        return response.json() as Promise<JokeResponse>;
      });

      const jokeResponses = await Promise.all(jokePromises);
      const newJokes: Joke[] = jokeResponses.map(response => ({
        id: response.id,
        joke: response.joke,
        timeShown: 0,
        startTime: Date.now()
      }));

      setJokes(newJokes);
    } catch (error) {
      console.error('Error fetching jokes:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJokes();
  }, [fetchJokes]);

  const handleDragStart = (e: React.DragEvent, joke: Joke) => {
    setDraggedJoke(joke);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', joke.id);
  };

  const handleDragEnd = () => {
    setDraggedJoke(null);
    setActiveDropZone(null);
  };

  const handleDragOver = (e: React.DragEvent, zone: 'loved' | 'not-funny') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setActiveDropZone(zone);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setActiveDropZone(null);
    }
  };

  const handleDrop = (e: React.DragEvent, reaction: 'loved' | 'not-funny') => {
    e.preventDefault();
    setActiveDropZone(null);
    
    if (!draggedJoke) return;

    const timeShown = Math.floor((Date.now() - draggedJoke.startTime) / 1000);
    const sortedJoke: Joke = {
      ...draggedJoke,
      reaction,
      timeShown
    };

    setJokes(prev => prev.filter(joke => joke.id !== draggedJoke.id));
    
    setSortedJokes(prev => [sortedJoke, ...prev]);
    
    setLastSortedJoke(sortedJoke);
    
    setDraggedJoke(null);
  };

  const handleUndo = () => {
    if (!lastSortedJoke) return;

    setSortedJokes(prev => prev.filter(joke => joke.id !== lastSortedJoke.id));
    
    const restoredJoke: Joke = {
      ...lastSortedJoke,
      reaction: undefined,
      startTime: Date.now()
    };
    setJokes(prev => [...prev, restoredJoke]);
    
    setLastSortedJoke(null);
  };


  const lovedCount = sortedJokes.filter(joke => joke.reaction === 'loved').length;
  const notFunnyCount = sortedJokes.filter(joke => joke.reaction === 'not-funny').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <div className="container mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold">Joke Sorter</h1>
            <ThemeToggle />
          </div>
          <p className="text-muted-foreground text-start">Drag jokes to sort them into "Loved It" or "Not Funny" zones.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Active Jokes ({jokes.length})</h2>
              <button onClick={fetchJokes} disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50">
                {isLoading ? 'Loading...' : 'New Jokes'}
              </button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : jokes.length > 0 ? (
              <div className="space-y-4">
                {jokes.map((joke) => (
                  <JokeCard
                    key={joke.id}
                    joke={joke}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedJoke?.id === joke.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">No more jokes!</h3>
                <p className="text-muted-foreground mb-4">You've sorted all the jokes. Want to load more?</p>
                <button onClick={fetchJokes} disabled={isLoading} className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50">
                  {isLoading ? 'Loading...' : 'Load New Jokes'}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Sort Here</h2>
            <div className="space-y-4">
              <DropZone
                type="loved"
                isActive={activeDropZone === 'loved'}
                onDrop={(e) => handleDrop(e, 'loved')}
                onDragOver={(e) => handleDragOver(e, 'loved')}
                onDragLeave={handleDragLeave}
                count={lovedCount}
              />
              <DropZone
                type="not-funny"
                isActive={activeDropZone === 'not-funny'}
                onDrop={(e) => handleDrop(e, 'not-funny')}
                onDragOver={(e) => handleDragOver(e, 'not-funny')}
                onDragLeave={handleDragLeave}
                count={notFunnyCount}
              />
            </div>
          </div>
        </div>

        {sortedJokes.length > 0 && (
          <section className="mt-12">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">Sorted Jokes</h2>
                <FilterControls
                  currentFilter={filter}
                  onFilterChange={setFilter}
                  onUndo={handleUndo}
                  canUndo={!!lastSortedJoke}
                  totalSorted={sortedJokes.length}
                />
              </div>
              <SortedJokesView jokes={sortedJokes} filter={filter} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
# Joke-Sorter-Quiz

This document provides a technical overview of the Joke Sorter application.

  Approach to Drag-and-Drop

  The drag-and-drop functionality is built using the native HTML5 Drag and Drop API, which provides a lightweight and dependency-free solution
  for this project's needs.

   - Draggable Items: The JokeCard component is made draggable by setting the draggable attribute to true.
   - Drag Events:
       - onDragStart: This event is fired on the JokeCard when the user begins dragging. It captures the joke's data and stores it in the
         draggedJoke state within the main JokeSorter component. It also sets the effectAllowed and dataTransfer properties to manage the drag
         operation.
       - onDragEnd: Cleans up the state by resetting draggedJoke and activeDropZone when the drag operation is finished (whether it was successful
         or not).
   - Drop Zones: The DropZone component handles the drop logic.
       - onDragOver: This event is crucial. We call event.preventDefault() to allow a drop to occur. It also sets the activeDropZone state to
         provide visual feedback (highlighting the drop zone) when a joke is dragged over it.
       - onDragLeave: Resets the activeDropZone state when the dragged item leaves the drop zone area.
       - onDrop: This is where the primary logic resides. When a joke is dropped, it reads the draggedJoke from the state, calculates the time it
         was displayed, updates its status to 'loved' or 'not-funny', and moves it from the active jokes array to the sortedJokes array.

  This approach was chosen for its simplicity and because it meets all the requirements of the application without introducing external libraries
  like react-dnd, keeping the bundle size smaller.

  How State and Timers are Handled

  State Management:

  The application's state is managed locally within the JokeSorter component using React's useState hook. This centralized approach within a single
   component is sufficient for the current scope of the project.

   - Core State Variables:
       - jokes: An array holding the list of 5 active jokes fetched from the API.
       - sortedJokes: An array containing all the jokes that the user has categorized. This is the primary data source for the "Sorted Jokes"
         view.
       - lastSortedJoke: Stores the most recently sorted joke to enable the "Undo" functionality.
       - isLoading: A boolean flag to manage the loading state while fetching new jokes, allowing the UI to display a loading indicator.
   - Persistence: To ensure a good user experience, the sortedJokes array is persisted to the browser's localStorage. A useEffect hook monitors
     changes to sortedJokes and automatically saves the updated array. When the application loads, it checks localStorage for any saved data and
     rehydrates the state.

  Timers:

  A timer is implemented to track how long each joke is visible to the user before being sorted.

   - When jokes are fetched, each joke object is augmented with a startTime timestamp (Date.now()).
   - The JokeCard component contains a useEffect hook that sets up an interval (setInterval). This interval runs every second to calculate and
     update the timeDisplayed state, which is shown on the card.
   - When the user drops a joke into a DropZone, the final timeShown is calculated by subtracting the startTime from the current time. This value
     is then saved with the joke in the sortedJokes array.

  Technical Tradeoffs and Assumptions

   - State Management: The decision to use local useState over a global state management library (like Redux or Zustand) was a deliberate tradeoff.
      For an application of this size, local state is simpler to manage and avoids unnecessary complexity and boilerplate. The assumption is that
     the app will not scale to a point where prop-drilling or complex state interactions become a significant issue.
   - Native Drag-and-Drop API: While libraries like dnd-kit offer more advanced features and better handling of edge cases (especially for touch
     devices and accessibility), the native HTML5 API was chosen for its simplicity and lack of dependencies. This was a tradeoff between
     features/robustness and simplicity/performance.
   - Client-Side Only: The application operates entirely on the client-side, with state persistence handled by localStorage. This assumes that
     there is no requirement for user accounts or data synchronization across multiple devices. A backend would be necessary to support such
     features.
   - API Dependency: The app relies solely on icanhazdadjoke.com. It assumes the API is available and performs well. There is no fallback
     mechanism or alternative data source implemented.

  What I'd Improve With More Time

   - Enhanced Accessibility (a11y): While basic semantic HTML is used, I would invest more time in making the application fully accessible. This
     would include implementing keyboard-based drag-and-drop, adding more comprehensive ARIA attributes, and ensuring all interactions are usable
     with screen readers.
   - Backend Integration: Develop a simple backend service (e.g., using Node.js/Express) to allow users to register and save
     their sorted jokes to a database. This would enable data persistence across sessions and devices.
   - Advanced State Management: If the application were to grow, I would refactor the state management to use a library like Zustand. It offers a
     simple API but provides the power of a centralized store, which would be beneficial for features like user authentication.
   - Optimistic UI Updates: To make the UI feel faster, especially with a backend, I would implement optimistic updates. For example, a joke would
     appear in the "Sorted Jokes" list instantly, even before the network request to save it has completed.
   
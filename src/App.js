import './App.css';
import Main from './components/MainComponent';
import {QueryClient, QueryClientProvider} from 'react-query';

function App() {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Main />
      </div>
    </QueryClientProvider>
  );
}

export default App;

// References
//
// https://stackoverflow.com/questions/60881824/how-to-prevent-deck-gl-layers-from-occupying-entire-viewport
// https://stackoverflow.com/questions/224602/how-do-you-make-div-elements-display-inline
// https://deck.gl/docs/api-reference/core/orthographic-view

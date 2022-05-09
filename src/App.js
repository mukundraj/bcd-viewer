import './App.css';
import Loader from './components/LoaderComponent';
import Scatterplot from './components/ScatterplotComponent';

function App() {

  return (
    <div>
      <Loader/>
    </div>
  );
}

export default App;

// References
//
// https://stackoverflow.com/questions/60881824/how-to-prevent-deck-gl-layers-from-occupying-entire-viewport
// https://stackoverflow.com/questions/224602/how-do-you-make-div-elements-display-inline
// https://deck.gl/docs/api-reference/core/orthographic-view

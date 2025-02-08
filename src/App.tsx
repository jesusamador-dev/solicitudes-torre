import React from 'react';
import ReactDOM from 'react-dom';
import 'mf_react_core/mf-style.scss';
import Welcome from './welcome/Welcome';

const App = () => {
  return (
    <>
      <Welcome></Welcome>
    </>
  );
};
/**uncomment this line to start up */
ReactDOM.render(<App />, document.getElementById('app'));

/**this lien is for test purposes */
// export default App;

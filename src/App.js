import React from 'react';
import HomePage from './pages/HomePage';
import './App.css';

// Importar estilos globales
import './styles/global.css';

function App() {
  return (
    <div className="App">
      <HomePage logoSrc={process.env.PUBLIC_URL + '/logo192.png'} />
    </div>
  );
}

export default App;

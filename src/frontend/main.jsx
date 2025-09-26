import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

function AcadWriteApp() {
    const [backendStatus, setBackendStatus] = useState('Verificando...');
    const [mongoStatus, setMongoStatus] = useState('Verificando...');

    const getBackendUrl = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:5000'; // Desarrollo local
    } else {
      return 'https://acadwrite-back.railway.app'; // Producción
    }
  };

  useEffect(() => {
    (async () => {
        const backendUrl = getBackendUrl();
      try {
        const resMain = await fetch(`${backendUrl}/`);
        const text = await resMain.text();
        setBackendStatus(text ? 'Conectado' : 'Error');
      } catch {
        setBackendStatus('Error');
      }

      try {
        const resHealth = await fetch(`${backendUrl}/health`);
        const data = await resHealth.json();
        setMongoStatus(data.database === 'Conectado' ? 'Conectado' : 'Error');
      } catch {
        setMongoStatus('Error');
      }
    })();
  }, []);


  return (
    <div>
        <h1>Bienvenido a AcadWrite</h1>
        <p>¡Hola Mundo! desde React</p>
        <div>Estado Backend: {backendStatus}</div>
        <div>Estado MongoDB: {mongoStatus}</div>
    </div>  
  ); 
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AcadWriteApp />);
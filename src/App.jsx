import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Header from './components/Header';




function App() {



  return (
    <div className="min-h-screen bg-yellow-100">
      <Header />
      <div className='relative flex bg-gradient-to-b from-gray-200 to-gray-500 border pt-14'>
        <Outlet />

      </div>

    </div>
  );
}

export default App;



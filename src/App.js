import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 
import Dashboard from './pages/dashboard/Dashboard';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
// import CreateProductForm from'./pages/Form/CreateProductForm';

function App() {
  return (
    <Router>
      <div className="app">
        
        <Sidebar />
      
        <div className="main">
          <Topbar title="Dashboard" buttonText="+ Thêm mới" />
          <div className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
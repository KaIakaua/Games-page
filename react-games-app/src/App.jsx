import { useState } from 'react'
import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/game/:id' element={<GameDetail />} />
      </Routes>
    </Router>
  )
}

export default App

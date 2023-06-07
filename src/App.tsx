import React from 'react'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import { Navbar } from 'components'
import Home from 'pages/Home/Home'

export const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

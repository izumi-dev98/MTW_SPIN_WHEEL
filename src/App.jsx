import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SpinSection from './components/SpinSection'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/spin" element={<SpinSection />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App

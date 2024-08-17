import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Routes>
    </>
  )
}

export default App

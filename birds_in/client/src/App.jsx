import { Routes, Route } from 'react-router-dom'
import { Landing } from './views/Landing'
import { Home } from './views/Home'
import { RegisterForm } from './components/RegisterForm'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
       
      </Routes>
    </>
  )
}

export default App

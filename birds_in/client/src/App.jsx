import { Routes, Route } from 'react-router-dom'
import { Landing } from './views/Landing'
import { Home } from './views/Home'
import { Index } from './components/SingUpTabs/Index'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/tab' element={<Index />}></Route>
      </Routes>
    </>
  )
}

export default App

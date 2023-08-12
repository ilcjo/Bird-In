import { Routes, Route } from 'react-router-dom'
import { Landing } from './views/Landing'
import { Options } from './views/Options'
import { Index } from './components/SingUpTabs/Index'
import { MainAves } from './views/Mains/MainAves'
import { MainAnimals } from './views/Mains/MainAnimals'
import { MainFlowers } from './views/Mains/MainFlowers'
import { MainLandsCapes } from './views/Mains/MainLandsCapes'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/menu' element={<Options />} />
        <Route path='/aves' element={<MainAves />} />
        <Route path='/animales' element={<MainAnimals />} />
        <Route path='/flores' element={<MainFlowers />} />
        <Route path='/paisajes' element={<MainLandsCapes />} />
        <Route path='/tab' element={<Index />}></Route>
      </Routes>
    </>
  )
}

export default App

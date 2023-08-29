import { Routes, Route } from 'react-router-dom'
import { Landing } from './views/Landing'
import { Index } from './components/SingUpTabs/Index'
import { Animals } from './views/Homes/Animals'
import { Flowers } from './views/Homes/Flowers'
import { LandsCapes } from './views/Homes/LandsCapes'
import { Home } from './views/HomeMenu'
import { Aves } from './views/Homes/Aves'
import { Filters } from './components/Filters'


function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/menu' element={<Home />} />
        <Route path='/aves' element={<Aves />} />
        <Route path='/animales' element={<Animals />} />
        <Route path='/flores' element={<Flowers />} />
        <Route path='/paisajes' element={<LandsCapes />} />
        <Route path='/tab' element={<Index />}></Route>
        <Route path='/filters' element={< Filters />}/>
      </Routes>
    </>
  )
}

export default App

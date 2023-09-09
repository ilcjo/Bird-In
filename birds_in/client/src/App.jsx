import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Landing } from './views/Landing'
import { Index } from './components/SingUpTabs/Index'
import { Animals } from './views/Homes/Animals'
import { Flowers } from './views/Homes/Flowers'
import { LandsCapes } from './views/Homes/LandsCapes'
import { Home } from './views/HomeMenu'
import { Aves } from './views/Homes/Aves'
import { CarruselGallery } from './components/Galeries/CarruselGallery'
import { useEffect } from 'react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

function App() {
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const [firstLoad, setFirstLoad] = useState(true);
  const {isAuthenticated} = useSelector(state => state.authSlice)

  useEffect(() => {
    if (firstLoad && token) {
      if (!isAuthenticated) {
        navigate('/aves');
      }
      setFirstLoad(false); 
    }
  }, [token, isAuthenticated, navigate, firstLoad]);
  return (
    <Routes>
    {token && (
      <>
        <Route path='/menu' element={<Home />} />
        <Route path='/aves' element={<Aves />} />
        <Route path='/animales' element={<Animals />} />
        <Route path='/flores' element={<Flowers />} />
        <Route path='/paisajes' element={<LandsCapes />} />
        <Route path='/galeria' element={<CarruselGallery />} />
      </>
    )}
    {!token && (
      <>
        <Route path='/' element={<Landing />} />
        <Route path='/tab' element={<Index />} />
      </>
    )}
  </Routes>
);
}


export default App

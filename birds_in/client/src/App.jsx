import { Routes, Route, useNavigate } from 'react-router-dom'
import { Landing } from './views/Landing'
import { Index } from './components/SingUpTabs/Index'
import { Animals } from './views/Homes/Animals'
import { Flowers } from './views/Homes/Flowers'
import { LandsCapes } from './views/Homes/LandsCapes'
import { Aves } from './views/Homes/Aves'
import { CarruselGallery } from './components/Galeries/CarruselGallery'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HomeMenu } from './views/HomeMenu'
import { Peces } from './views/Homes/Peces'
import { clearToken } from './redux/slices/Auth'
import { Dashboard } from './views/Homes/Dashboard'
import { SobreMi } from './views/Homes/SobreMi'
import { PhotosDetail } from './components/PhotosDetail'
import { PassRecover } from './views/PassRecover'

function App() {

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const dispatch = useDispatch()
  // const [firstLoad, setFirstLoad] = useState(true);
  const { isAuthenticated } = useSelector(state => state.authSlice)

  useEffect(() => {
    if (token) {
      if (!isAuthenticated) {
        localStorage.clear();
        dispatch(clearToken())
        navigate('/')
      }

      // setFirstLoad(false);
    }
  }, [token, isAuthenticated, navigate]);

  return (
    <Routes>
      {token && (
        <>
          <Route path='/menu' element={<HomeMenu />} />
          <Route path='/aves' element={<Aves />} />
          <Route path='/animales' element={<Animals />} />
          <Route path='/flores' element={<Flowers />} />
          <Route path='/paisajes' element={<LandsCapes />} />
          <Route path='/peces' element={<Peces />} />
          <Route path='/galeria' element={<CarruselGallery />} />
          <Route path='/sobremi' element={<SobreMi />} />
          <Route path='/panelAdministrador' element={<Dashboard />} />
          <Route path='/detalle' element={<PhotosDetail />} />
          <Route path='/' element={<Landing />} />
        </>
      )}
      {!token && (
        <>
          <Route path='/' element={<Landing />} />
          <Route path='/tab' element={<Index />} />
        </>
      )}
      <Route path='/recuperar' element={<PassRecover />} />
    </Routes>
  );
}


export default App

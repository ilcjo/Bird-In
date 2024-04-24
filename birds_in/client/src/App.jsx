import { useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearToken } from './redux/slices/Auth'
import { PassRecover } from './views/PassRecover'
import { HomeMenu } from './views/HomeMenu'
import { Aves } from './views/Mains/Aves'
import { Animals } from './views/Mains/Animals'
import { Flowers } from './views/Mains/Flowers'
import { LandsCapes } from './views/Mains/LandsCapes'
import { Peces } from './views/Mains/Peces'
import { CarruselGallery } from './components/Galeries/Aves/CarruselGallery'
import { SobreMi } from './views/Mains/SobreMi'
import { Dashboard } from './views/Mains/Dashboard'
import { PhotosDetail } from './components/Mains/Aves/PhotosDetail'
import { Landing } from './views/Landing'
import { Index } from './components/SingUpTabs/Index'

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
          <Route path='/Recuperar' element={<PassRecover />} />
        </>
      )}
    </Routes>
  );
}


export default App

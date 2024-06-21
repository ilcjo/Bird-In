import { Routes, Route } from 'react-router-dom'
import { PassRecover } from './views/PassRecover'
import { HomeMenu } from './views/HomeMenu'
import { Aves } from './views/Mains/Aves'
import { Animals } from './views/Mains/Animals'
import { Flowers } from './views/Mains/Flowers'
import { LandsCapes } from './views/Mains/LandsCapes'
import { Peces } from './views/Mains/Peces'
import { CarruselGallery } from './components/Galeries/Aves/CarruselGallery'
import { SobreMi } from './views/Mains/SobreMi'


import { Landing } from './views/Landing'
import { Index } from './components/SingUpTabs/Index'
import { DashAves } from './views/Dash/DashAves'
import { DashPaisajes } from './views/Dash/DashPaisajes'
import { ProtectedRoute } from './ProtectedRoute'
import { MenuBar } from './components/Menus/MenuBar'
import { PhotosDetailAves } from './components/Mains/Aves/PhotosDetailAves'
import { TimeOut } from './components/utils/TimeOut'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/tab" element={<Index />} />
      <Route path="/Recuperar" element={<PassRecover />} />
      <Route path='/tiempo' element={<TimeOut />} />
      <Route path="/menu" 
        element={
          <ProtectedRoute roles={['user', 'admin']} >
            <MenuBar ShowFilterButton={false} ShowBackButton={false} showAdmin={false} />
            <HomeMenu />
          </ProtectedRoute>
        } />
      <Route path="/sobremi"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <SobreMi />
          </ProtectedRoute>
        } />
      <Route
        path="/detalle"
        element={<ProtectedRoute roles={['user', 'admin']}>
          <PhotosDetailAves />
        </ProtectedRoute>
        } />
      <Route path="/galeria"
        element={
          <ProtectedRoute roles={['user', 'admin']} >
            <CarruselGallery />
          </ProtectedRoute>
        } />
      <Route path="/aves"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Aves />
          </ProtectedRoute>
        } />
      <Route path="/animales"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Animals />
          </ProtectedRoute>
        } />
      <Route path="/flores"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Flowers />
          </ProtectedRoute>
        } />
      <Route path="/paisajes"
        element={<ProtectedRoute roles={['user', 'admin']}>
          <LandsCapes />
        </ProtectedRoute>
        } />
      <Route path="/peces" element={
        <ProtectedRoute roles={['user', 'admin']} >
          <Peces />
        </ProtectedRoute>
      } />


      <Route path="/panelaves" // DASHBOARDS
        element={
          <ProtectedRoute roles={['admin']} >
            <DashAves />
          </ProtectedRoute>
        } />
      <Route path="/panelpaisajes"
        element={<ProtectedRoute roles={['admin']} >
          <MenuBar ShowFilterButton={false} ShowBackButton={true} />
          <DashPaisajes />
        </ProtectedRoute>
        } />
    </Routes>
  );
}


export default App

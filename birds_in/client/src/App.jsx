import { Routes, Route } from 'react-router-dom'
import { PassRecover } from './views/PassRecover'
import { HomeMenu } from './views/HomeMenu'
import { Aves } from './views/Mains/Aves'
import { LandsCapes } from './views/Mains/LandsCapes'
import { Peces } from './views/Mains/Peces'
import { CarruselGallery } from './components/Gallery/CarruselGallery'
import { SobreMi } from './views/Mains/SobreMi'


import { Landing } from './views/Landing'
import { Index } from './components/SingUpTabs/Index'
import { DashAves } from './views/Dash/DashAves'
import { DashPaisajes } from './views/Dash/DashPaisajes'
import { ProtectedRoute } from './ProtectedRoute'
import { MenuBar } from './components/Menus/MenuBar'
import { PhotosDetailAves } from './components/Mains/Aves/PhotosDetailAves'
import { TimeOut } from './components/utils/TimeOut'
import { DashSettings } from './views/Dash/DashSettings'
import { Mamiferos } from './views/Mains/Mamiferos'
import { Reptiles } from './views/Mains/Reptiles'
import { DashMamiferos } from './views/Dash/DashMamiferos'
import { DashReptiles } from './views/Dash/DashReptiles'
import { Insectos } from './views/Mains/Insectos'
import { DashInsectos } from './views/Dash/DashInsectos'

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
            <MenuBar ShowFilterButton={false} ShowBackButton={false} showAdmin={false} ShowMantButton={true} />
            <HomeMenu />
          </ProtectedRoute>
        } />
      <Route path="/sobremi"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <MenuBar ShowBackButton={true} ShowFilterButton={false} />
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
      <Route path="/mamiferos"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Mamiferos />
          </ProtectedRoute>
        } />
      <Route path="/reptiles"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Reptiles />
          </ProtectedRoute>
        } />
      <Route path="/insectos"
        element={
          <ProtectedRoute roles={['user', 'admin']}>
            <Insectos />
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
            <MenuBar ShowFilterButton={false} ShowBackButton={true} />
            <DashAves />
          </ProtectedRoute>
        } />
      <Route path="/panelpaisajes"
        element={
          <ProtectedRoute roles={['admin']} >
            <MenuBar ShowFilterButton={false} ShowBackButton={true} />
            <DashPaisajes />
          </ProtectedRoute>
        } />
      <Route path="/panelmamiferos"
        element={<ProtectedRoute roles={['admin']} >
          <MenuBar ShowFilterButton={false} ShowBackButton={true} />
          <DashMamiferos />
        </ProtectedRoute>
        } />
      <Route path="/mantenimiento"
        element={<ProtectedRoute roles={['admin']} >
          <MenuBar ShowFilterButton={false} ShowBackButton={true} />
          <DashSettings />
        </ProtectedRoute>
        } />
      <Route path="/panelreptiles"
        element={<ProtectedRoute roles={['admin']} >
          <MenuBar ShowFilterButton={false} ShowBackButton={true} />
          <DashReptiles />
        </ProtectedRoute>
        } />
      <Route path="/panelInsectos"
        element={<ProtectedRoute roles={['admin']} >
          <MenuBar ShowFilterButton={false} ShowBackButton={true} />
          <DashInsectos />
        </ProtectedRoute>
        } />
    </Routes>
  );
}


export default App


import { createRoot } from 'react-dom/client'
import './index.css'
import App from './designingComponents/App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import Login from './forms/Login.jsx'
import Register from './forms/Register.jsx'
import ProtectedRoutes from './security/ProtectedRoutes.jsx'
import Unauth from './designingComponents/Unauth.jsx'
import AdminDashboard from './adminComponents/AdminDashBoard.jsx'
import Features from './designingComponents/Features.jsx'
import About from './designingComponents/About.jsx'
import HrDashboard from './hrComponents/HrDashboard.jsx'
import StaffDashboard from './staffComponents/StaffDashboard.jsx'
import HrProtectedRoute from './security/HrProtectedRoute.jsx'
import StaffProtectedRoute from './security/StaffProtectedRoute.jsx'
import IsAuthenticated from './security/IsAuthenticated.jsx'
import NotAuthenticated from './security/NotAuthenticated.jsx'
import NotFound from './designingComponents/NotFound.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <AuthProvider>
    <BrowserRouter>
      <Routes>

     
        <Route path='/' element={<App />}/>
        <Route path='/features' element={<Features/>}/>
        <Route path='/aboutUs' element={<About/>}/>
        <Route path='/unauth' element={<Unauth/>}/>
        

         <Route element={<NotAuthenticated/>}>
             <Route path='/login' element={<Login/>}/>
             <Route path='/register' element={<Register/>}/>
         </Route>

     

       <Route element={<IsAuthenticated/>}>

        <Route path='/adminDashboard/*' element={<ProtectedRoutes><AdminDashboard/></ProtectedRoutes>}/>
        <Route path='/hrDashboard/*' element={<HrProtectedRoute><HrDashboard/></HrProtectedRoute>}/>
        <Route path='/staffDashboard/*' element={<StaffProtectedRoute><StaffDashboard/></StaffProtectedRoute>}/>
        
       </Route>

       <Route path='*' element={<NotFound/>}/>
        
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
)


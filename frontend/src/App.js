import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import WelcomePage from './pages/WelcomePage';
import ColorPalette from './pages/ColorPalette';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <NavBar/>
        <div >
          <Routes> 
            <Route path = "*" element={<NotFound/>}/>
            <Route path = "/" element={<Home/>}/>
            <Route path = "/home" element={<Home/>}/>
            <Route path = "/sign-in" element={<SignIn/>}/>
            <Route path = "/sign-up" element={<SignUp/>}/> 
            <Route path = "/dashboard" element={<Dashboard/>}/>
            <Route path = "/settings" element={<Settings/>}/>
            <Route path = "/Welcome" element={<WelcomePage/>}/>
            <Route path = "/color-palette" element={<ColorPalette/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
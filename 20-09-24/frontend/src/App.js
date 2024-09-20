import './App.css';
import Login from './Components/Module 1/Components/Login/login';
import Register from './Components/Module 1/Components/Register/register';
import Landing_page from './Components/Module 2/Components/Landing-page/Landing_page';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// const router=createBrowserRouter([
//   {
//     path: '/',
//     element: <div><Login/></div>
//   },
//   {
//     path: '/register',
//     element: <div><Register/></div>
//   },
//   {
//     path: '/dashboard',
//     element: <div><Dashboard/></div>
//   }
// ]);

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />}></Route>
          <Route path='/landing_page' element={<Landing_page />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

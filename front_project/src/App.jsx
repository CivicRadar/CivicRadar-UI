import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import AuthPage from "./signuplogin";
import { CitizenProvider } from "./context/CitizenContext";
import { MayorProvider } from "./context/MayorContext";
import { AdminProvider } from "./context/AdminContext";
import CitizenDashboard from "./Dashboard/CitizenDashboard"; // صفحه داشبورد
import MayorDashboard from  "./Dashboard/MayorDashboard"
import AdminDashboard from "./Dashboard/AdminDashboard"
import PrivateRoute from "./Components/PrivateRoute"; // وارد کردن PrivateRoute


import "./App.css"
function App() {
  return (
          <Router>
    <CitizenProvider> {/* ✅ حالا کل برنامه داخل CitizenProvider قرار گرفته است */}
      <MayorProvider>
        <AdminProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signuplogin" element={<AuthPage />} />
              <Route 
            path="/CitizenDashboard" 
            element={
              <PrivateRoute role="Citizen">
                <CitizenDashboard />
              </PrivateRoute>
              
            } 
          />
             <Route 
            path="/MayorDashboard" 
            element={
              <PrivateRoute role="Mayor">
                <MayorDashboard />
              </PrivateRoute>
              
            } 
          />
           <Route 
            path="/AdminDashboard" 
            element={
              <PrivateRoute role="Admin">
                <AdminDashboard />
              </PrivateRoute>
              
            } 
          />
            </Routes>
        </AdminProvider>
      </MayorProvider>
    </CitizenProvider>
          </Router>
  );
}

export default App;






// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

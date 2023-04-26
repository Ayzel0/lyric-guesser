import { useState, useEffect } from 'react';
import { accessToken, logout } from './spotify';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Profile from './pages/Profile';
import Login from './pages/Login';
import './App.css'

function App() {
  // function variables; initially sets token var to null
  const [token, setToken] = useState(null);

  // function which runs on mount. Can add other things to dependency array, upon which useEffect will run again
  useEffect(() => {
    setToken(accessToken)
  }, [])

  // console.log(token)

  return (
    <>
      <div className='App'>
        {!token ? (
          <Login />
        ) : (
          <div className='logged-in-content'>
            <button className='logout-button' onClick={logout}>Log Out</button>
            <Router>
              <Routes>
                <Route path="/" element={<Profile/>}/>
                <Route path="/top-artists" element={<h1>Top Artists</h1>}/>
              </Routes>
            </Router>
          </div>
        )}
      </div>
    </>
  )
}

export default App
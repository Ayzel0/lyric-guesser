import { useState, useEffect } from 'react';
import { accessToken } from './spotify';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Profile from './pages/Profile';
import Login from './pages/Login';

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
          <Router>
            <Routes>
              <Route path="/" element={<Profile/>}/>
            </Routes>
          </Router>
        )}
      </div>
    </>
  )
}

export default App
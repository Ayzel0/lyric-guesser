import { useState, useEffect } from 'react';
import { accessToken } from './spotify'

function App() {
  // function variables; initially sets token var to null
  const [token, setToken] = useState(null);

  // function which runs on mount. Can add other things to dependency array, upon which useEffect will run again
  useEffect(() => {
    setToken(accessToken)
  }, [])

  console.log(token)

  return (
    <>
      {!token ? (
        <p>no token</p>
      ) : (
        <div>
          <h1>Current token is {token}</h1>
          <LoginButton />
        </div>
      )}
    </>
  )
}

export default App
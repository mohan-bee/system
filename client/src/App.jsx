import React, { useState } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

const App = () => {
  const [page, setPage] = useState('login')
  return (
    <div>
      <div className=''>
      {page == "login" && <Login setPage={setPage} /> }
      {page == "dashboard" && <Dashboard />}
      </div>
    </div>
  )
}

export default App
import { useState } from 'react'
import './App.css'
import SideBar from '../Components/SideBar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex text-green-700 font-bold">
        <SideBar/>
      </div>
    </>
  )
}

export default App

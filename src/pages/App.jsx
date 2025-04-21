import { useState } from 'react'
import './App.css'
import SideBar from '../components/SideBar'

// Component Imports
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function App() {
  return (
    <>
      <div className="flex text-green-700 font-bold">
        <SideBar/>
        <Button variant="outline">Button</Button>
        <Progress value={33} />
      </div>
    </>
  )
}
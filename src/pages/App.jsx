import { useState } from 'react'
import '../index.css'
import SideBar from '../components/SideBar'

// Component Imports
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

export default function App() {
  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2 font-bold">
        <SideBar/>
        <Input className={"text-amber-100 "} placeholder="Quiz Kodunu Girin" />
        <Button variant="destructive" type="submit">Gir</Button>
      </div>
    </>
  )
}
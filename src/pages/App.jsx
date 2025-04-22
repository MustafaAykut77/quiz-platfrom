import { useState } from 'react'
import '../index.css'
import SideBar from '../components/SideBar'

// Component Imports
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function App() {
  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2 font-bold">
        <SideBar/>

        <Button variant="destructive" className={"absolute right-5 top-5 text-amber-100 h-15 w-15"} type="submit">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Button>

        <Input className={"text-amber-100"} placeholder="Quiz Kodunu Girin" />
        <Button variant="destructive" className={"text-amber-100 h-13 w-15"} type="submit">Gir</Button>
      </div>
    </>
  )
}
import '../index.css'
import "../config/firebase-config"
import { useAuth } from '../contexts/authContext/page'

const Qwiz = () => {
  const { currentUser } = useAuth()
  return (
    <>
     <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}
      , you are now logged in.</div>
    </>
  )
}

export default Qwiz;
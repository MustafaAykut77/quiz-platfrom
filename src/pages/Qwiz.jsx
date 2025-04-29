import '../index.css'
import "../config/firebase-config"
import { useAuth } from '../contexts/authContext/page'
import axios from "axios";

const getData = async (token) => {
  const response = await axios.get(`http://localhost:3000/protected`, {
    headers: {
        Authorization: `Bearer ${token}`
    },
  });
  console.log(response);
}

const Qwiz = () => {
  const { currentUser } = useAuth()
  // JWT token
  // console.log(currentUser.accessToken)
  getData(currentUser.accessToken);
  return (
    <>
     <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}
      , you are now logged in.</div>
    </>
  )
}

export default Qwiz;
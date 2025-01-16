import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';


const Home = () => {

  const { businessID } = useParams()
  const [businessData, setBusinessData] = useState({
    banner: '',
    logo: '',
    name: '',
    description: '',
    address: '',
    phone: '',
  })


  useEffect(() => {
    console.log('businessID', businessID);
    localStorage.setItem('businessID', businessID)
  },[])



  return (
    <div className='w-full min-h-screen flex flex-col items-center bg-g10'>
      
            {/* gradiente de arriba */}
            <div className="fixed z-10 -top-[675px] left-[50%] -translate-x-1/2  bg-[linear-gradient(40deg,#4C2DFF_0%,#DE9FFE_100%)] h-[765px] w-[100vw] " />
            <h1 className="fixed top-8 left-7  w-full text-white text-xl font-black z-10 ">
        EASY AGENDA
      </h1>
      <img
              className="fixed top-7 right-7 z-50"
              src="/images/hamburger.svg"
              width={32}
              alt="menu"
              onClick={() => {
                console.log('menu')
              }}
            />

      <div className='bg-g10 absolute pb-20 top-[9rem] flex flex-col items-center w-full min-h-screen'>


      {/*business card */}
      <div className='relative w-[80%] flex flex-col items-center bg-white h-[20rem] shadow-md rounded-md'>
        <div className='w-full h-[40%] bg-[url("images/flowersbanner.webp")] bg-cover'></div>
        
        {/*logo and business name when fetched */}
        <div className='w-full h-[60%] absolute top-1/2 -translate-y-[65%]  flex flex-col items-center justify-center'>
          <img src="https://res.cloudinary.com/do8wkypcn/image/upload/v1737050655/app-citas/bazasalon_logo.png" width={90} />
          <h1 className='text-xl font-bold'>Mónica Baza Salon</h1>
        </div>
        
        <div className='w-full h-[60%] text-center flex items-end p-4 text-base'>
          <p> 
          Nuestro compromiso es brindarte un servicio de alta calidad y un ambiente relajante, donde tu satisfacción es nuestra prioridad.

          </p>
        </div>

      </div>

      <button className='mt-[4rem] px-3 py-2 font-black rounded-md   bg-blue text-white w-[200px]'>Agendar Cita</button>

      {/*maps integration */}
      <h1 className='text-xl font-black mt-[4rem] mb-4'>Encuéntranos Aquí</h1>
      <div className='[4rem] w-[80%] h-[20rem] bg-white rounded-md shadow-md flex flex-col items-center'></div>
      
        </div>

    {/* footer de abajo */}
    
    </div>
  )
}

export default Home
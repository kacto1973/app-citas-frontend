import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import { getBusinessData } from "../../firebaseFunctions";
import MapComponent from "../components/MapComponent";

const Home = () => {
  const { businessID } = useParams();
  const [businessData, setBusinessData] = useState({
    banner: "",
    logo: "",
    name: "",
    description: "",
    addressUrl: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    console.log("businessID", businessID);
    localStorage.setItem("businessID", businessID);

    // fetch business data
    const asyncFunc = async () => {
      const businessInfo = await getBusinessData();

      setBusinessData(businessInfo);
    };
    asyncFunc();
  }, []);

  useEffect(() => {
    console.log("business data: " + JSON.stringify(businessData));
  }, [businessData]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-g10">
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
          console.log("menu");
        }}
      />

      <div className="bg-g10 absolute  top-[9rem] flex flex-col items-center w-full min-h-screen">
        {/*business card */}
        <div className="relative w-[90%] flex flex-col items-center bg-white h-[20rem] shadow-md rounded-md">
          <img
            src={businessData.banner}
            className={`w-full h-[40%] bg-cover`}
          />

          {/*logo and business name when fetched */}
          <div className="w-full h-[60%] absolute top-1/2 -translate-y-[65%]  flex flex-col items-center justify-center">
            <img src={businessData.logo} width={90} />
            <h1 className="text-xl font-bold">{businessData.name}</h1>
          </div>

          <div className="w-full h-[60%] text-center flex items-center p-4 text-base">
            <p className="mt-10">{businessData.description}</p>
          </div>
        </div>

        <button className="mt-[4rem] px-3 py-2 font-black rounded-md   bg-blue text-white w-[200px]">
          Agendar Cita
        </button>

        {/*maps integration */}
        <h1 className="text-xl font-black mt-[4rem] mb-4">Aquí nos ubicamos</h1>
        <div className="[4rem] w-[80%] h-[24rem] bg-white rounded-md shadow-md flex flex-col items-center">
          <div className="w-full h-[70%]">
            <MapComponent
              businessMapUrl={businessData.addressUrl}
            ></MapComponent>
          </div>
          <div className="flex flex-col m-4">
            <div className="flex flex-row items-center mb-3">
              <img src="/images/location.svg" alt="checkmarks" width={22} />
              <p className="ml-2">{businessData.address}</p>
            </div>
            <div className="flex flex-row items-center mb-3">
              <img
                src="/images/whatsapp_black.svg"
                alt="checkmarks"
                width={20}
              />
              <p className="ml-2">+52 {businessData.phone}</p>
            </div>
          </div>
        </div>

        {/* lo de abajo */}
        <div className="bg-[linear-gradient(160deg,#4C2DFF_0%,#DE9FFE_190%)] mt-[6rem]  w-full h-[18vh] relative flex flex-col">
          <div className="m-5">
            <h1 className="font-black text-white text-xl w-[100%] mb-50">
              Usa Easy Agenda en tu negocio
            </h1>
            <div className="flex flex-row items-center my-3">
              <img src="/images/mail_white.svg" alt="checkmarks" width={22} />
              <p className="text-white ml-3">luisbaza.0519@gmail.com</p>
            </div>
            <div className="flex flex-row items-center my-3">
              <img
                src="/images/whatsapp_white.svg"
                alt="checkmarks"
                width={20}
              />
              <p className="text-white ml-3">+52 662 423 7920</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

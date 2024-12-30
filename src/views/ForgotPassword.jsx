import React from "react";
import { useState, useEffect } from "react";
import { findClientByPhoneNumber } from "../../firebaseFunctions";

const ForgotPassword = () => {
  //const [dataFound, setDataFound] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [foundUsername, setFoundUsername] = useState("");
  // const [foundPassword, setFoundPassword] = useState("");

  const handleClick = async (phoneNumber) => {
    const string = phoneNumber.toString();
    //filtramos los campos
    if (string.length !== 10) {
      alert("El número de celular debe tener 10 dígitos");
      return;
    }
    console.log("hola desde click, esto es phone number string ", string);
    const foundClient = await findClientByPhoneNumber(string);
    if (foundClient) {
      console.log(foundClient);

      //enviar mensaje al usuario con sus datos
      // setFoundUsername(foundClient.username);
      // setFoundPassword(foundClient.password);
      const message = `Tus datos de inicio de sesión en easy agenda son los siguientes 😊:\n
      *Usuario:* ${foundClient.username}\n
      *Contraseña:* ${foundClient.password}\n
      Si tienes alguna duda,\n
      contáctanos al:\n
      +52 662 423 7920.`;

      const body = {
        phoneNumber: foundClient.cellphone,
        message: message,
      };

      const response = await fetch(
        "https://app-citas-backend.vercel.app/api/data-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        alert("Mensaje enviado con éxito");
      }
    } else {
      alert("El número de celular no se encontró, pruebe nuevamente");
    }
  };

  useEffect(() => {
    console.log(phoneNumber);
  }, [phoneNumber]);

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(194deg,#4C2DFF_0%,#DE9FFE_100%)]  min-h-screen flex flex-col justify-center items-center">
      {/* <p className="text-white text-sm absolute top-[1%]">
        Si eres administrador, envía mensaje al +52 662-423-7920
      </p> */}
      <p className="absolute text-white top-[20%] font-black w-[80%] text-center">
        Si ya te registraste y olvidaste tus datos, te los enviaremos a tu
        whatsapp para que puedas iniciar sesión sin problemas
      </p>
      <img
        className="absolute bottom-[15%] left-[20%] z-10"
        src="/images/cellphone3d.png"
        width={100}
        alt="cellphone3d"
      />
      <img
        className="absolute bottom-[15%] right-[20%] z-10"
        src="/images/chatbubble3d.png"
        width={120}
        alt="chatbubble3d"
      />
      <div className="absolute  bg-g4 -bottom-[135%] -right-[160%] w-[200%] h-[200%] rotate-144" />
      <div className="absolute top-0 bg-g4 w-full text-center h-[13%] rounded-b-[30px] flex justify-center items-center">
        <h1 className="text-3xl font-black text-white">Datos</h1>
      </div>
      <div className="z-50 w-[85%] rounded-3xl p-5 text-center bg-g7 absolute  left-[50%] top-[50%] transform -translate-x-1/2  -translate-y-1/2 ">
        <h1 className="relative  mx-auto  text-black text-2xl font-black">
          Ingresa tu número de celular
        </h1>

        <form className="w-full">
          <div className="flex flex-col items-center justify-center w-full">
            <input
              className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
              type="number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="6623456789"
              required
            />
            <button
              onClick={(e) => {
                e.preventDefault();

                const asyncFunc = async () => {
                  await handleClick(phoneNumber);
                };
                asyncFunc();
              }}
              className="px-2 py-2 rounded-md mt-8 mb-3 bg-g8 text-white w-[120px]"
            >
              Enviar
            </button>

            {/* {dataFound && (
              <div className="bg-c1 flex flex-col  p-5 rounded-md items-center justify-center ">
                <h1 className="mx-auto  text-white text-xl font-black">
                  Tu Usuario
                </h1>
                <input
                  className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
                  type="text"
                  value={foundUsername}
                />

                <h1 className="mx-auto mt-6 text-white text- xl font-black">
                  Tu Contraseña
                </h1>
                <input
                  className="border border-black rounded-md mt-4 py-1 w-[150px] text-center"
                  type="text"
                  value={foundPassword}
                />
              </div>
            )} */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;

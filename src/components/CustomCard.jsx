import React, { useState } from "react";
import { Card, CardContent, Typography } from "@mui/material";

function CustomCard() {
  // Definir un estado de pago (puede ser true o false)
  const [isPaid, setIsPaid] = useState(false);

  return (
    <Card sx={{ maxWidth: 500 }}>
      {/* Franja de color condicional */}
      <div
        style={{
          height: "20px",
          backgroundColor: isPaid ? "green" : "orange", // Azul si pagado, verde si no
          width: "100%",
        }}
      />
      <CardContent>
        <Typography variant="h5" component="div">
          13/12/2024
        </Typography>
        <Typography variant="body2" color="text.secondary">
          a las 10:15 (duración de 1 hr )
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • corte ($400)
        </Typography>
        {/* Botón para cambiar el estado de pago */}
        <button onClick={() => setIsPaid(!isPaid)}>
          {isPaid ? "Pago realizado" : "Pagar ahora"}
        </button>
      </CardContent>
    </Card>
  );
}

export default CustomCard;

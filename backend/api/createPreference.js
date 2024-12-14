const mercadopago = require("mercadopago");

// Configura tu access token de Mercado Pago
mercadopago.configurations.setAccessToken(
  process.env.MERCADO_PAGO_ACCESS_TOKEN
);

// Función para crear la preferencia
module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      const preference = {
        items: [
          {
            title: "Anticipo de cita pref",
            unit_price: 100, // Aquí pones el precio del producto o servicio
            quantity: 1,
          },
        ],
        back_urls: {
          success: "https://mb-salon-citas.netlify.app/",
          failure: "https://mb-salon-citas.netlify.app/",
          pending: "https://mb-salon-citas.netlify.app/",
        },
        auto_return: "approved",
      };

      // Crea la preferencia en Mercado Pago
      const preferenceResponse = await mercadopago.preferences.create(
        preference
      );
      const preferenceId = preferenceResponse.body.id;

      // Responde con el ID de la preferencia para que el frontend lo use
      res.status(200).json({ preferenceId });
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
      res
        .status(500)
        .json({ error: "Hubo un problema al crear la preferencia" });
    }
  } else {
    res.status(405).json({ error: "Método no permitido" });
  }
};

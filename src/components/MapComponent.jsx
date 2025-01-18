import React from "react";

const MapComponent = ({ businessMapUrl }) => {
  return (
    <iframe
      src={businessMapUrl}
      className="w-full h-full"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default MapComponent;

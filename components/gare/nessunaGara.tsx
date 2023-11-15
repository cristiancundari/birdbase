import React from "react";

function NessunaGara({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div>
      Nessuna gara trovata.
      {isAdmin &&
        " Inizia creando un nuova gara utilizzando il pulsante Aggiungi in alto"}
    </div>
  );
}

export default NessunaGara;

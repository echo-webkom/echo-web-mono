"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

import { Button } from "../../../../../../components/ui/button";

interface props {
  userId: string;
}

export const ShowQrCode = ({ userId }: props) => {
  const [show, setShow] = useState(false);

  return (
    <div>
      <Button className="mb-5" onClick={() => setShow((prev) => !prev)}>
        {show ? "Lukk" : "Vis QR kode"}
      </Button>
      {show && <QRCode size={250} bgColor="white" fgColor="black" value={userId} />}
    </div>
  );
};

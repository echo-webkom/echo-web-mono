import React from "react";
import { Button } from "@react-email/button";
import { Html } from "@react-email/html";

export default function UnregisterEmail() {
  return (
    <Html>
      <Button
        pX={20}
        pY={12}
        href="https://example.com"
        style={{ background: "#000", color: "#fff" }}
      >
        Click me
      </Button>
    </Html>
  );
}

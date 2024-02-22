import React from "react";
import Navbar from "@/components/Navbar";
import { Container } from "@mantine/core";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar>
        <Container size="xl" p={0} mih="100%">
          {children}
        </Container>
      </Navbar>
    </>
  );
}

export default layout;

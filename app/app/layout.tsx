import React from "react";
import Navbar from "@/components/navbar";
import { Container } from "@mantine/core";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar>
        <Container size="xl" p={0}>
          {children}
        </Container>
      </Navbar>
    </>
  );
}

export default layout;

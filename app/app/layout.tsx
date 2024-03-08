"use client";
import Navbar from "@/components/Navbar";
import StreamChatStoreInit from "@/store/StreamChatStoreInit";
import { Container } from "@mantine/core";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar>
        <Container size="xl" p={0} h="100%">
          {children}
        </Container>
      </Navbar>
      <StreamChatStoreInit />
    </>
  );
}

export default Layout;

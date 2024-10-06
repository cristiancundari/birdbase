"use client";
import BirdbaseChat from "@/components/messaggi/BirdbaseChat";
import { Box, Card } from "@mantine/core";
import React from "react";

function MessaggiPage() {
  return (
    <Card
      radius="lg"
      shadow="md"
      withBorder
      p={0}
      w="100%"
      id="stream-chat-root"
    >
      <BirdbaseChat />
    </Card>
  );
}

export default MessaggiPage;

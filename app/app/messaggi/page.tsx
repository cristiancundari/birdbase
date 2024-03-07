"use client";
import BirdbaseChat from "@/components/messaggi/BirdbaseChat";
import { Box, Card } from "@mantine/core";
import React from "react";

function MessaggiPage() {
  return (
    <Box p="lg" h="100%">
      <Card radius="lg" id="stream-chat-root" shadow="md" withBorder p={0}>
        <BirdbaseChat />
      </Card>
    </Box>
  );
}

export default MessaggiPage;

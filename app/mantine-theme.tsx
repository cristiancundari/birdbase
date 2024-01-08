"use client";
import { Modal, createTheme } from "@mantine/core";

export default createTheme({
  cursorType: "pointer",
  defaultRadius: "md",
  primaryColor: "indigo",
  components: {
    Modal: Modal.extend({
      styles: {
        title: {
          flexGrow: 1,
          textAlign: "center",
          fontWeight: 500,
          marginLeft: "28px",
        },
      },
    }),
  },
});

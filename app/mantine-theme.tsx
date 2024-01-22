"use client";
import {
  Input,
  Modal,
  Popover,
  SegmentedControl,
  Tooltip,
  createTheme,
} from "@mantine/core";

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
    SegmentedControl: SegmentedControl.extend({
      styles(theme, props) {
        if (props.value == "") {
          return {
            indicator: {
              width: "0px",
              height: "0px",
              transform: "translate(0px, 0px)",
            },
          };
        }
        return { indicator: {} };
      },
    }),
    Tooltip: Tooltip.extend({
      defaultProps: { withinPortal: false },
    }),
    Popover: Popover.extend({
      defaultProps: { withinPortal: false },
    }),
  },
});

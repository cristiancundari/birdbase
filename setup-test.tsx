import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/notifications/styles.css";
import "./app/globals.css";

import { notifications } from "@mantine/notifications";
import "@testing-library/jest-dom";
import {
  cleanup,
  render as testingLibraryRender,
} from "@testing-library/react";
import { afterAll, afterEach, vi } from "vitest";
import LayoutProviders from "./providers/LayoutWrapper";
import { act } from "react-dom/test-utils";
import { debug } from "vitest-preview";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const ResizeObserverMock = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Stub for Apexchart
Object.defineProperty(global.SVGElement.prototype, "getScreenCTM", {
  writable: true,
  value: vi.fn(),
});

Object.defineProperty(global.SVGElement.prototype, "createSVGMatrix", {
  writable: true,
  value: vi.fn().mockReturnValue({
    x: 10,
    y: 10,
    inverse: () => {},
    multiply: () => {},
  }),
});

//Disable ApexChart animations for testing
Object.defineProperty(window, "Apex", {
  writable: true,
  value: { chart: { animations: { enabled: false } } },
});

// Stub the global ResizeObserver
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

afterEach((context) => {
  // Pulire le notifiche di Mantine.dev
  notifications.clean();

  // Run vitest-preview's debug if the test fails
  if (context.task.result?.state === "fail") {
    debug();
  }

  // Clean up react-testing-library. We need to manually do this because we
  // turn off the automatic teardown in the vite.config.
  // This needs to happen after vitest-preview
  cleanup();
});

export function render(ui: React.ReactNode) {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <LayoutProviders>{children}</LayoutProviders>
    ),
  });
}

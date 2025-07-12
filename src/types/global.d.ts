
// Global type definitions for third-party integrations

declare global {
  interface Window {
    ihfKestrel?: {
      render: () => HTMLElement;
      config: {
        platform: string;
        activationToken: string;
      };
    };
  }
}

export {};

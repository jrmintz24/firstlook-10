
declare global {
  interface Window {
    ihfKestrel: {
      config?: {
        platform: string;
        activationToken: string;
      };
      render: () => HTMLElement;
    };
  }
}

export {};

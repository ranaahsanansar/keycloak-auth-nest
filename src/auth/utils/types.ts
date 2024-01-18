export type CreateKeycloakUserT = {
  username: string;
  enabled: boolean;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  email: string;
  credentials: [
    {
      type: string;
      value: string;
      temporary: boolean;
    },
  ];
};

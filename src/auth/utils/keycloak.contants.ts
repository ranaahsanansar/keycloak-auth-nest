require('dotenv').config();
export const keycloakConfig = {
  keycloakBaseUrl: process.env.KEYCLOAK_BASEURL,
  realmName: process.env.REALM_NAME,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  userName: process.env.ADMIN_USER_NAME,
  password: process.env.ADMIN_PASSWORD,
};

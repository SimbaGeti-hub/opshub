/**
 * Development values. Separate test and production environments arrive with
 * the Docker and CI phases, which swap this file at build time.
 */
export const environment = {
  apiUrl: 'http://localhost:3000/api/v1',
  keycloakUrl: 'http://localhost:8080',
  keycloakRealm: 'opshub',
  keycloakClientId: 'opshub-web',
};

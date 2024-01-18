import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { keycloakConfig } from './utils/keycloak.contants';
import { CreateKeycloakUserT } from './utils/types';

@Injectable()
export class KeycloakService {
  private clientToken: string;

  // Private Functions-------------------------------------------------
  private async createUser(userData: CreateKeycloakUserT) {
    let url = `${keycloakConfig.keycloakBaseUrl}/admin/realms/${keycloakConfig.realmName}/users`;

    await axios.post(url, userData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.clientToken}`,
      },
    });
  }

  // Public Functions-----------------------------------------------------

  /**
   * Generates a client token for keycloak Admin API
   */
  async generateClientToken() {
    let url = `${keycloakConfig.keycloakBaseUrl}/realms/${keycloakConfig.realmName}/protocol/openid-connect/token`;

    const formData = {
      grant_type: 'password',
      client_id: keycloakConfig.clientId,
      client_secret: keycloakConfig.clientSecret,
      username: keycloakConfig.userName,
      password: keycloakConfig.password,
    };

    let axiosResponse = null;
    await axios
      .post(url, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((data) => {
        axiosResponse = data;
      })
      .catch((e) => {
        console.log(e);
      });

    /**
     * 
     {
      access_token: 'eyJhbGciOiJXYOjkCe9t1JNh6bB78_2zxW-qR_S6JhgU_No5m7gp_L7o333buDP1q-fO9qVS_llaVbeY7Sm7cILL9hc4KwJlLxadqeJQQyvq0QA-1W4TsXprToihQIQ3KZiPhMXtcc_AWYn6qTshgxbwYjjXYznL8aOXCweYAIYLjkr_ziv9ufec-1Y32ADk32ZR9JosON-E7oJBBxzEYTNipD4jGaTcypKN-AKViSX61TtSrfKvZ9d57C4hxmtFYEg2wmMXG9nRDw',
      expires_in: 1680,
      refresh_expires_in: 0,
      token_type: 'Bearer',
      'not-before-policy': 0,
      scope: 'email profile'
      }
     */

    // TODO: Check Circular dependency in future
    this.clientToken = axiosResponse.data.access_token;
    // console.log(this.clientToken);
  }

  async resgiterUserInKeycloak(userData: CreateKeycloakUserT) {
    try {
      const newUser: CreateKeycloakUserT = userData;

      await this.createUser(newUser);

      console.log('Created');

      return true;
    } catch (error) {
      console.log(error.message);
      throw new ConflictException(error.message);
    }
  }

  async getUserByUsername(userName: string) {
    let url = `${keycloakConfig.keycloakBaseUrl}/admin/realms/${keycloakConfig.realmName}/users`;

    let userResponse = null;
    await axios
      .get(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.clientToken}`,
        },
        params: {
          username: userName,
        },
      })
      .then((res) => {
        userResponse = res;
      })
      .catch((e) => {
        console.log('Error', e);
      });

    return userResponse.data[0];
  }

  async loginUser(userName: string, password: string) {
    let url = `${keycloakConfig.keycloakBaseUrl}/realms/${keycloakConfig.realmName}/protocol/openid-connect/token`;

    const formData = {
      grant_type: 'password',
      client_id: keycloakConfig.clientId,
      client_secret: keycloakConfig.clientSecret,
      username: userName,
      password: password,
    };

    let axiosResponse = null;
    await axios
      .post(url, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((data) => {
        axiosResponse = data;
      })
      .catch((e) => {
        console.log(e);
        throw new NotFoundException(e.response?.data?.error_description);
      });

    return axiosResponse.data;

    /**
     * 
     {"access_token":"eyJhbGciOiJSUzI1NcU5xOHJCVThrTWtXQWdUN2E2YkJrIn0.eyJleHAiOjE3MDU1ODU5MTgs",
     "expires_in":1740,
     "refresh_expires_in":1800,"refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6vZm",
     "token_type":"Bearer",
     "not-before-policy":1705234706,
     "session_state":"ca7cf699-8f04-47b5-97ef-5d33bfb0ecff",
     "scope":"email profile"}
     */
  }

  async refreshToken(refreshToken: string) {
    let url = `${keycloakConfig.keycloakBaseUrl}/realms/${keycloakConfig.realmName}/protocol/openid-connect/token`;

    const formData = {
      grant_type: 'refresh_token',
      client_id: keycloakConfig.clientId,
      client_secret: keycloakConfig.clientSecret,
      refresh_token: refreshToken,
    };

    let axiosResponse = null;
    await axios
      .post(url, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      .then((data) => {
        axiosResponse = data;
      })
      .catch((e) => {
        console.log(e);
        throw new NotFoundException(e.response?.data?.error_description);
      });

    return axiosResponse.data;
  }
}

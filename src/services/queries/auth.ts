import { setCookie } from "nookies";
import { IUserData } from "../../@types/user";
import api from "../utils/api";
import httpClient from "../utils/httpClient";

interface ILoginResponseData {
  token: string;
  user: IUserData;
}

interface ILoginWithTokenResponseData {
  user: IUserData;
}

class Auth {
  public logout() {
    api.defaults.headers.common['Authorization'] = '';
  }

  public async login(username: string, password: string) {
    const response = await httpClient<ILoginResponseData>({
      method: 'post',
      url: '/auth/authenticate',
      data: { customId: username, password },
    });

    const { data, isError } = response;

    if (isError || !data) {
      return response;
    }

    const token = `Bearer ${data.token}`;

    api.defaults.headers.common['Authorization'] = token;

    setCookie(null, 'chat@token', token, {
      maxAge: 60 * 60 * 24 * 1, // 1 day
    })

    return response;
  }

  public async loginWithToken(token: string) {
    api.defaults.headers.common['Authorization'] = token;

    const response = await httpClient<ILoginWithTokenResponseData>({
      method: 'get',
      url: '/auth/token-authenticate',
    });

    const { data, isError } = response;

    if (isError || !data) {
      return response;
    }

    return response;
  }
}

export default new Auth();

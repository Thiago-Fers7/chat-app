import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import api from "./api";

interface IReponse<T> {
  data: T | null;
  isError: boolean;
  errorMessage: string;
}

interface IReponseErrorData {
  message: string;
  status: 'error';
}

export default async function httpClient<T>(config: AxiosRequestConfig): Promise<IReponse<T>> {
  try {
    const response = await api(config);

    const { data } = response as AxiosResponse;

    return { data, errorMessage: '', isError: false };
  } catch (error) {
    const genericErrorMessage = 'Erro inesperado. Tente novamente mais tarde';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<IReponseErrorData>;
      const reponseMessage = axiosError.response?.data?.message;

      const message = reponseMessage ?? genericErrorMessage;

      return { data: null, isError: true, errorMessage: message };
    }

    return { data: null, isError: true, errorMessage: genericErrorMessage };
  }
}

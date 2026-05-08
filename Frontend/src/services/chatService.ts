import type { AxiosResponse } from "axios";
import { axiosInstance } from "../lib/axios";

export const CHAT_REQUEST_SESSION_ENDPOINT = "/api/v1/chat/request-session";

type NewSessionResponseData = {
  session_id: string;
  expires_at: string;
};

export type NewSessionResponse = {
  status: string;
  message: string;
  data: NewSessionResponseData;
};

export const chatService = {
  getNewSession(opts: { signal?: AbortSignal } = {}): Promise<AxiosResponse<NewSessionResponse>> {
    return axiosInstance.get<NewSessionResponse>(CHAT_REQUEST_SESSION_ENDPOINT, {
      signal: opts.signal,
    });
  },
};

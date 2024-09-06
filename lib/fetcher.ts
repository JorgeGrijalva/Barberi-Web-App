import { BASE_URL } from "@/config/global";
import { deleteCookie, getCookie } from "cookies-next";
import { ErrorResponse } from "@/types/global";
import NetworkError from "@/utils/network-error";
import { notFound, redirect } from "next/navigation";

import { userActionOutsideOfComponent } from "@/global-store/user";

interface CustomRequestInit extends RequestInit {
  redirectOnError?: boolean;
}

const fetcher = async <T>(input: string | string[], init?: CustomRequestInit): Promise<T> => {
  const url = `${BASE_URL}${Array.isArray(input) ? input[0] : input}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: getCookie("token") as string,
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const errorResponse = (await res.json()) as ErrorResponse;
    // eslint-disable-next-line
    let errorMessage = errorResponse.message;
    if (errorResponse?.params) {
      // eslint-disable-next-line prefer-destructuring
      errorMessage = Object.values(errorResponse.params)?.[0]?.[0];
    }
    if (res.status === 401) {
      userActionOutsideOfComponent({ user: null });
      deleteCookie("token");
      return redirect("/");
    }
    if (init?.redirectOnError && res.status === 404) {
      return notFound();
    }
    throw new NetworkError(errorMessage, res.status, errorResponse?.params);
  }
  return res.json();
};

export default fetcher;

interface MutationRequestInit extends Omit<RequestInit, "body" | "method"> {
  body: unknown;
}

fetcher.post = async <T>(input: string, init?: MutationRequestInit): Promise<T> =>
  fetcher(input, {
    ...init,
    method: "POST",
    body: JSON.stringify(init?.body),
    headers: { "Content-Type": "application/json" },
  });

fetcher.put = async <T>(input: string, init?: MutationRequestInit): Promise<T> =>
  fetcher(input, {
    ...init,
    method: "PUT",
    body: JSON.stringify(init?.body),
    headers: { "Content-Type": "application/json" },
  });

fetcher.delete = async <T>(input: string, init?: MutationRequestInit): Promise<T> =>
  fetcher(input, {
    ...init,
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(init?.body),
  });

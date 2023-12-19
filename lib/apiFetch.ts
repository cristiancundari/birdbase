import { ApiResponse } from "@/types/types";
import z from "zod";
export const apiFetch = {
  get,
  post,
  put,
  delete: _delete,
};

async function get<T = any>(url: string) {
  const requestOptions = {
    method: "GET",
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

async function post<T = any>(url: string, body: any) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

async function put<T = any>(url: string, body: any) {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete<T = any>(url: string) {
  const requestOptions = {
    method: "DELETE",
  };
  const response = await fetch(url, requestOptions);
  return handleResponse<T>(response);
}

// helper function
interface SuccessHandler<T> {
  error: false;
  data: T;
}
interface ErrorHandler {
  error: true;
  message: string;
}
async function handleResponse<T>(
  response: Response
): Promise<SuccessHandler<T> | ErrorHandler> {
  const text = await response.text();
  const data = text && JSON.parse(text, reviveDate);
  if (!response.ok) {
    const error =
      (Boolean(data) && (data.message as string)) || response.statusText;
    return { error: true as true, message: error };
  }
  // Verifico se la risposta del server rispetta il formato ApiResponse
  const schema = z.custom<ApiResponse>();
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    // Se non rispetta il formato ritorno comunque i dati facendo il parse con il tipo generico <T>
    return { data: data as T, error: false as false };
  } else {
    if (parsed.data.error) {
      // Se rispetta il formato ma il server ha ritornato un errore
      return { error: true as true, message: parsed.data.message };
    } else {
      return { data: parsed.data.result as T, error: false as false };
    }
  }
}

function reviveDate(key: string, value: any) {
  // Matches 2019-06-20T12:29:43.288Z (with milliseconds) and 2019-06-20T12:29:43Z (without milliseconds)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,})?Z$/;
  return typeof value === "string" && isoDateRegex.test(value)
    ? new Date(value)
    : value;
}

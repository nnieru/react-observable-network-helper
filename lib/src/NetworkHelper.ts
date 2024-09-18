import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import {
  BehaviorSubject,
  catchError,
  delay,
  finalize,
  from,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { HttpMethod } from "./HttpRequestMethod";
import { RequestState } from "./RequestState";

export type RequestFactoryRequest<T> = {
  url: string;
  mapper: (data: T) => T;
  maxRetries?: number;
  refreshToken?: () => Observable<string>;
  params?: any;
  body?: any;
  httpMetod: HttpMethod;
  config: AxiosRequestConfig;
  onErrorAction?: (response: AxiosResponse) => void;
};

const ongoingRequests = new Map();

// Axios request interceptor
axios.interceptors.request.use(
  (config) => {
    const key = config.url;
    if (ongoingRequests.has(key)) {
      ongoingRequests.get(key).abort(); // Cancel the previous request
      ongoingRequests.delete(key);
    }

    const controller = new AbortController();
    config.signal = controller.signal;

    ongoingRequests.set(key, controller);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios response interceptor
axios.interceptors.response.use(
  (response) => {
    const key = response.config.url;
    ongoingRequests.delete(key);
    return response;
  },
  (error) => {
    if (error.config && error.config.url) {
      ongoingRequests.delete(error.config.url);
    }

    return Promise.reject(error);
  }
);
// v2
/**
 * Creates a network request and returns an Observable that emits the mapped response data.
 * @template T - The type of the response data.
 * @param {RequestFactoryRequest<T>} options - The options for the network request.
 * @returns {Observable<T>} - An Observable that emits the mapped response data.
 */
export function RequestFactory<T>({
  url,
  mapper,
  onErrorAction,
  params,
  body,
  httpMetod,
  config,
}: RequestFactoryRequest<T>): Observable<T> {
  let retries = 0;

  return new Observable<T>((observer) => {
    const requestBuilder = () => {
      switch (httpMetod) {
        case HttpMethod.GET:
          return axios.get(url, { ...config, params: params });
        case HttpMethod.POST:
          return axios.post(url, body, config);
        case HttpMethod.PUT:
          return axios.put(url, body, config);
        case HttpMethod.DELETE:
          return axios.delete(url, config);
        default:
          return axios.get(url, { ...config, params: params });
      }
    };
    const makeRequest = () => {
      requestBuilder()
        .then((response) => {
          const mappedData = mapper(response.data);
          observer.next(mappedData);
          observer.complete();
        })
        .catch((err) => {
          if (axios.isCancel(err)) {
            observer.complete();
            return;
          }

          if (onErrorAction) {
            onErrorAction(err.response);
          }

          observer.error(err);
        });
    };
    makeRequest();
  }).pipe(
    delay(1000),
    finalize(() => {})
  );
}

/**
 * Executes a network request and returns an Observable that emits the request state.
 *
 * @template T - The type of data returned by the network request.
 * @param obs - The Observable representing the network request.
 * @returns An Observable that emits the request state.
 */
export function executeRequest<T>(obs: Observable<T>) {
  const initialState: RequestState<T> = {
    data: null,
    error: false,
    loading: true,
    success: false,
    errorResponse: null,
  };

  const requestState$ = new BehaviorSubject<RequestState<T>>(initialState);

  requestState$.next({ ...initialState, loading: true });

  return from(obs).pipe(
    switchMap((value) =>
      of({
        loading: false,
        error: false,
        data: value,
        success: true,
        errorResponse: null,
      })
    ),
    catchError((err) => {
      requestState$.next({
        ...initialState,
        error: true,
        errorResponse: err,
        loading: false,
      });

      return of({
        ...initialState,
        loading: false,
        error: true,
        errorResponse: err,
      });
    }),
    finalize(() => {
      requestState$.next({ ...requestState$.getValue(), loading: false });
    })
  );
}

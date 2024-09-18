import { useCallback, useEffect, useState } from "react";
import { executeRequest } from "./NetworkHelper";
import { Observable } from "rxjs";
import { RequestState } from "./RequestState";

// Define a custom hook to manage multiple requests
/**
 * Custom hook to manage HTTP client state using observables.
 *
 * @template T - The type of the data expected from the observable.
 * @param {Observable<T>} observables - The observable that emits the HTTP request states.
 * @returns {RequestState<T> & { fetchData: () => void }} - The current state of the request and a function to initiate the request.
 *
 * @example
 * const { data, error, loading, success, fetchData } = useObservableHttpClient(myObservable);
 *
 * useEffect(() => {
 *   fetchData();
 * }, [fetchData]);
 */
export function useObservableHttpClient<T>(observables: Observable<T>) {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    error: false,
    loading: false,
    success: false,
    errorResponse: null,
  });

  const fetchData = useCallback(() => {
    setState({
      data: null,
      error: false,
      loading: true,
      success: false,
      errorResponse: null,
    });

    const subscription = executeRequest(observables).subscribe({
      next(newState) {
        setState(newState);
      },
      error(err) {
        setState({
          ...state,
          error: true,
          errorResponse: err,
          loading: false,
        });
      },
    });

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe();
  }, [observables, state]);

  return { ...state, fetchData };
}

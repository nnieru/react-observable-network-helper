/**
 * Represents the state of a request.
 *
 * @template T - The type of data returned by the request.
 */
export interface RequestState<T> {
  loading: boolean;
  success: boolean;
  error: boolean;
  errorResponse: Error | null;
  data: T | null;
}

/**
 * Cart Management System - Error Handling Utilities
 * @author AJ McCrory
 * @created 2024
 * @description Utilities for handling and displaying errors
 */

export class RequestError extends Error {
  status_code: number;

  constructor(message: string, status_code: number) {
    super(message);
    this.status_code = status_code;
    this.name = 'RequestError';
  }
}

export const displayErrorMessage = (error: unknown): string => {
  if (error instanceof RequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
      throw new RequestError(
        errorData.message || 'An unexpected error occurred',
        response.status
      );
    } catch (error) {
      if (error instanceof RequestError) {
        throw error;
      }
      throw new RequestError(
        response.statusText || 'An unexpected server error occurred',
        response.status
      );
    }
  }
  return response;
}; 
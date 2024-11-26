/**
 * Cart Management System - Error Handling Utilities
 * @author AJ McCrory
 * @created 2024
 * @description Standardized error handling and formatting
 */

export interface APIError {
  message: string;
  status_code: number;
}

export class RequestError extends Error {
  status_code: number;

  constructor(message: string, status_code: number) {
    super(message);
    this.status_code = status_code;
    this.name = 'RequestError';
  }
}

export const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorData: APIError;
    try {
      errorData = await response.json();
      throw new RequestError(errorData.message, errorData.status_code);
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

export const displayErrorMessage = (error: unknown): string => {
  if (error instanceof RequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}; 
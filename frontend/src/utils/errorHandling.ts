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
    } catch {
      throw new RequestError(
        'An unexpected error occurred',
        response.status
      );
    }
    throw new RequestError(
      errorData.message || 'An unexpected error occurred',
      errorData.status_code
    );
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
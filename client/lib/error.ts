/**
 * Formats error objects into readable messages
 * Prevents "[object Object]" display by properly extracting messages
 */
export function formatErrorMessage(error: unknown): string {
  if (!error) return "Unknown error";

  if (error instanceof Error) return error.message;

  if (typeof error === "object") {
    // Handle Supabase errors and other objects with message property
    const errorObj = error as any;
    if (errorObj.message) return errorObj.message;

    // Try to stringify the object for debugging
    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown object error";
    }
  }

  return String(error);
}

/**
 * Logs errors with proper formatting
 */
export function logError(context: string, error: unknown): void {
  console.error(`${context}:`, formatErrorMessage(error));
}

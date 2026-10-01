// Supabase errors are plain objects, not Error instances, so `instanceof Error`
// checks hide their message. This turns any thrown value into readable text.
export function describeError(error: unknown, duplicateMessage = "That record already exists.") {
  const code = typeof error === "object" && error !== null && "code" in error ? String((error as { code?: unknown }).code) : undefined;
  if (code === "23505") return duplicateMessage;
  if (code === "42501") return "Your role does not allow this change.";
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) return String((error as { message?: unknown }).message);
  return "Unexpected error";
}

// types/firebaseErrorTypes.ts
export interface FirebaseError extends Error {
  code: string;
}

export interface FirebaseAuthError extends FirebaseError {
  email?: string;
}

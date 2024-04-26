export class FirebaseError extends Error {
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "FirebaseError";
    this.code = code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirebaseError);
    }
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        stack: this.stack,
      },
    };
  }
}

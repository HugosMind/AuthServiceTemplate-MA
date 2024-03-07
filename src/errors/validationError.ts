export class ValidationError extends Error {
  constructor(public validationErrors: Array<any>) {
    super('Validation failed');
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
  }
}

export class InternalError extends Error {
  constructor(public details: Array<any>) {
    super('Internal Server Error');
  }
}

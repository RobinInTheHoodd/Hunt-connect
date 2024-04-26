import { jest } from "@jest/globals";

jest.spyOn(console, "error").mockImplementation(() => {});
jest.mock("firebase-admin", () => ({
  database: jest.fn(() => ({
    ref: jest
      .fn(() => ({
        remove: jest.fn(),
      }))
      .mockReturnThis(),
    child: jest.fn().mockReturnThis(),
    transaction: jest.fn(),
    set: jest.fn(),
    get: jest.fn(),
    once: jest.fn(),
    update: jest.fn(),
    exists: jest.fn().mockReturnThis(),
    val: jest.fn().mockReturnThis(),
    remove: jest.fn().mockReturnThis(),
    catch: jest.fn(),
  })),

  auth: jest.fn(() => ({
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    createCustomToken: jest.fn(),
  })),

  initializeApp: jest.fn(),
  apps: [],
  credential: {
    cert: jest.fn().mockReturnValue({}),
  },
}));

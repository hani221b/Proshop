import { PrismaClient } from "@prisma/client";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

jest.mock("@prisma/client", () => ({
  __esModule: true,
  PrismaClient: jest.fn().mockImplementation(() => mockDeep<PrismaClient>()),
}));

export const prismaMock =
  mockDeep<PrismaClient>() as DeepMockProxy<PrismaClient>;

(PrismaClient as jest.MockedClass<typeof PrismaClient>).mockImplementation(
  () => prismaMock as any
);

beforeEach(() => {
  jest.clearAllMocks();
});

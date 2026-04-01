import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";

// 🔥 MOCK DO PRISMA (sempre antes do import do app)
const mockPrisma = {
  prescription: {
    findMany: jest.fn().mockResolvedValue([
      { id: 1, text: "Mock text", observation: "Mock obs" }
    ]),
    findUnique: jest.fn().mockImplementation(({ where }) =>
      where.id === 999
        ? null
        : { id: where.id, text: "Mock text", observation: "Mock obs" }
    ),
    create: jest.fn().mockResolvedValue({
      id: 1,
      recordId: 1,
      text: "Mock text",
      observation: "Mock obs"
    }),
    update: jest.fn().mockResolvedValue({
      id: 1,
      text: "Atualizado",
      observation: "Atualizada"
    }),
    delete: jest.fn().mockResolvedValue({}),
  },
  record: {
    findFirst: jest.fn(({ where }) =>
      where.id === 999 ? null : { id: where.id }
    )
  },
  $disconnect: jest.fn(),
};

jest.unstable_mockModule("../src/prisma.js", () => ({
  default: mockPrisma,
}));

// 🔥 IMPORTS DEPOIS DO MOCK
const request = (await import("supertest")).default;
const app = (await import("../src/app.js")).default;

// 🔑 GERAR TOKEN REAL
const token = jwt.sign(
  { id: 1 },
  process.env.JWT_SECRET || "PROJETO_INTEGRADOR",
  { expiresIn: "1h" }
);

describe("Testes de Prescriptions", () => {

  test("CT-PRESC-01: criar prescription (201)", async () => {
    const res = await request(app)
      .post("/prescriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        recordId: 1,
        text: "Tomar 1 comprimido à noite",
        observation: "Paciente em tratamento"
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });

  test("CT-PRESC-02: criar prescription com recordId inválido (404)", async () => {
    const res = await request(app)
      .post("/prescriptions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        recordId: 999,
        text: "Texto inválido",
        observation: "Teste"
      });

    expect(res.status).toBe(404);
  });

  test("CT-PRESC-03: buscar ID inexistente (404)", async () => {
    const res = await request(app)
      .get("/prescriptions/999")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  test("CT-PRESC-04: atualizar prescription (200)", async () => {
    const res = await request(app)
      .put("/prescriptions/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Atualizado",
        observation: "Atualizada"
      });

    expect(res.status).toBe(200);
  });

  test("CT-PRESC-05: deletar prescription (200)", async () => {
    const res = await request(app)
      .delete("/prescriptions/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
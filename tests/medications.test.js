import request from "supertest";
import app from "../src/app.js";

describe("Testes de Medicamentos", () => {
  let token = "";

  beforeAll(async () => {
    const cpf = "1234678903";
    const senha = "123456";

    const response = await request(app).post("/users/login").send({ cpf, senha });
    token = response.body.token;
  });

  test("deve criar um novo medicamento com sucesso (status 201)", async () => {
    const uniqueName = `medicamento_${Date.now()}`;
    const novoMedicamento = {
      name: uniqueName,
      dosage: "50mg",
      quantity: 100,
      type: "comprimido",
      expiresAt: "2026-12-31T23:59:59.000Z",
    };

    const response = await request(app)
      .post("/medications")
      .set("Authorization", `Bearer ${token}`)
      .send(novoMedicamento);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    expect(response.body.name).toBe(novoMedicamento.name);
    expect(response.body.dosage).toBe(novoMedicamento.dosage);
    expect(response.body.quantity).toBe(novoMedicamento.quantity);
    expect(response.body.type).toBe(novoMedicamento.type);
    expect(response.body.expiresAt).toBe(novoMedicamento.expiresAt);
  });

  test("deve retornar 400 quando um campo obrigatório for omitido", async () => {
    const medicamentoIncompleto = {
      dosage: "500mg",
      quantity: 100,
      type: "comprimido",
      expiresAt: "2025-12-31",
    };

    const response = await request(app)
      .post("/medications")
      .set("Authorization", `Bearer ${token}`)
      .send(medicamentoIncompleto)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message.toLowerCase()).toContain("por favor, preencha todos os campos.");
  });

  test("deve listar todos os medicamentos (status 200, array de objetos)", async () => {
    const response = await request(app)
      .get("/medications")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(2);

    response.body.forEach((medicamento) => {
      expect(medicamento).toHaveProperty("id");
      expect(medicamento).toHaveProperty("name");
      expect(medicamento).toHaveProperty("dosage");
      expect(medicamento).toHaveProperty("quantity");
      expect(medicamento).toHaveProperty("type");
      expect(medicamento).toHaveProperty("expiresAt");
      expect(medicamento).toHaveProperty("createdAt");
      expect(medicamento).toHaveProperty("updatedAt");
    });
  });

  test("deve alterar campos de um medicamento existente (status 200)", async () => {
    const uniqueName = `medicamento_${Date.now()}`;

    const createResponse = await request(app)
      .post("/medications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: uniqueName,
        dosage: "50mg",
        quantity: 1000,
        type: "comprimido",
        expiresAt: "2026-12-31T23:59:59.000Z",
      })
      .expect(201);

    const medicationId = createResponse.body.id;

    const dadosAtualizados = {
      quantity: 500,
    };

    const response = await request(app)
      .put(`/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .set('Accept', 'application/json')
      .send(dadosAtualizados)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.quantity).toBe(dadosAtualizados.quantity);
    expect(response.body.id).toBe(medicationId);
    expect(response.body).toHaveProperty("name", uniqueName);
    expect(response.body).toHaveProperty("dosage", "50mg");
    expect(response.body).toHaveProperty("type", "comprimido");
    expect(response.body).toHaveProperty("expiresAt", "2026-12-31T23:59:59.000Z");
    expect(response.body.updatedAt).not.toBe(response.body.createdAt);
  });

  test("deve deletar um medicamento e retornar 204", async () => {
    const uniqueName = `medicamento_${Date.now()}`;

    const createResponse = await request(app)
      .post("/medications")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: uniqueName,
        dosage: "50mg",
        quantity: 1000,
        type: "comprimido",
        expiresAt: "2026-12-31T23:59:59.000Z",
      })
      .expect(201);

    const medicationId = createResponse.body.id;

    await request(app)
      .delete(`/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);

    const getResponse = await request(app)
      .get(`/medications/${medicationId}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(404);

    expect(getResponse.body).toHaveProperty("error");
  });
});
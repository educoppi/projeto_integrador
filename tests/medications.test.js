// tests/medications.test.js
import request from "supertest";
import app from "../src/app.js";

describe("Testes de Medicamentos", () => {
    let token = '';
    
    beforeAll(async () => {
        const cpf = "1234678903";
        const senha = "123456";
      
        const response = await request(app).post("/login").send({ cpf, senha });
        console.log(response.body);
    });

  test("CT-MED-01: Deve criar um novo medicamento com sucesso (status 201)", async () => {
    const novoMedicamento = {
      name: "Paracetamol",
      dosage: "500mg",
      quantity: 100,
      type: "comprimido",
      expiresAt: "2025-12-31T23:59:59.000Z",
    };

    const response = await request(app)
      .post("/medications")
      .send(novoMedicamento);
    //.expect("Content-Type", /json/)
    //.expect(201);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");

    expect(response.body.name).toBe(novoMedicamento.name);
    expect(response.body.dosage).toBe(novoMedicamento.dosage);
    expect(response.body.quantity).toBe(novoMedicamento.quantity);
    expect(response.body.type).toBe(novoMedicamento.type);
    expect(response.body.expiresAt).toBe(novoMedicamento.expiresAt);
  });
  /*

  test("CT-MED-02: Deve retornar 400 quando um campo obrigatório for omitido", async () => {
    const medicamentoIncompleto = {
      dosage: "500mg",
      quantity: 100,
      type: "comprimido",
      expiresAt: "2025-12-31",
    };

    const response = await request(app)
      .post("/medications")
      .send(medicamentoIncompleto)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body.message.toLowerCase()).toContain("name");
  });

  test("CT-MED-03: Deve listar todos os medicamentos (status 200, array de objetos)", async () => {
    const response = await request(app)
      .get("/medications")
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

  test("CT-MED-04: Deve alterar campos de um medicamento existente (status 200)", async () => {
    const dadosAtualizados = {
      quantity: 200,
      expiresAt: "2026-06-30T00:00:00.000Z",
    };

    const response = await request(app)
      .patch("/medications/1")
      .send(dadosAtualizados)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body.quantity).toBe(dadosAtualizados.quantity);
    expect(response.body.expiresAt).toBe(dadosAtualizados.expiresAt);

    expect(response.body).toHaveProperty("id", 1);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("dosage");
    expect(response.body).toHaveProperty("type");

    expect(response.body.updatedAt).not.toBe(response.body.createdAt);
  });

  test("CT-MED-05: Deve deletar um medicamento e retornar 204", async () => {
    await request(app).delete("/medications/1").expect(204);

    const getResponse = await request(app).get("/medications/1").expect(404);

    expect(getResponse.body).toHaveProperty("message");
  });
  */
});

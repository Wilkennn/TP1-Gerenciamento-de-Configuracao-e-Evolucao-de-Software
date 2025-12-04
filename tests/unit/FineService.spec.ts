import { FineService } from "../../src/services/FineService";

describe("FineService - Cálculo de Multas", () => {
  it("deve calcular a multa corretamente (R$ 2,00 por dia)", () => {
    const service = new FineService();
    const diasAtraso = 5;
    
    const multa = service.calculate(diasAtraso);

    expect(multa).toBe(10); 
  });
});
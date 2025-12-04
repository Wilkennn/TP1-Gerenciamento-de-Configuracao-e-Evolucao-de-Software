export class FineService {
  // Método simples para calcular multa baseada em dias
  calculate(days: number): number {
    // BUG: Estamos cobrando apenas 1 real por dia, mas a regra é 2
    const valorPorDia = 2; 
    return days * valorPorDia;
  }
}
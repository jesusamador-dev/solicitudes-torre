
export interface ISummary {
  description: string;
  value: number;
  type: string;
  percentage: {
    value: number;
    type: number;
    orientation: number;
  };
}

export type Resumen = {
  comparacion: string;
  texto: string;
  totalActual: number;
  totalAnterior: number;
  semanaComparacion: number;
  rangoComparacion: string;
};

export class Summary implements ISummary {

  description: string;
  value: number;
  type: string;
  percentage: {
    value: number;
    type: number;
    orientation: number;
  };

  constructor(
    description: string,
    value: number,
    type: string,
    percentage: {
      value: number,
      type: number,
      orientation: number
    }
  ) {
    
    this.description = description; 
    this.value = value; 
    this.type = type;
    this.percentage = percentage;
  }

  static fromJson(json: Resumen): Summary {
    const {totalActual, totalAnterior} = json

    let diferencia = 0
      if(totalActual != 0 && totalAnterior != 0){
          diferencia = (( totalActual - totalAnterior) / ((totalActual + totalAnterior) / 2));
      }else {
          diferencia = 0
      }

    const porcentajeDiferencia = Math.abs(Math.round(diferencia * 100));
    const isNegative = (totalAnterior > totalActual ? 0 : 1);

    return new Summary("Total de solicitudes esta semana", json.totalActual, isNegative == 0 ? "negative" : "positive", {value: porcentajeDiferencia, type: isNegative, orientation: isNegative });
  }
}

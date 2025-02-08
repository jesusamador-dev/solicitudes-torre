export type Solicitud = {
    descripcionEmbudo: string;
    valor: number;
    tipo: number;
    porcentaje: {
      valor: number;
      tipo: number;
      orientacion: number;
    };
  };
  
  export type Percentaje = {value: number; type: number; orientation: number};
  
  export interface IRequest {
    descriptionFunnel: string;
    value: number;
    type: number;
    percentage: Percentaje;
  }
  
  export class Request implements IRequest {
    descriptionFunnel: string;
    value: number;
    type: number;
    percentage: Percentaje;
  
    constructor(descriptionFunnel: string, value: number, type: number, percentage: Percentaje) {
      this.descriptionFunnel = descriptionFunnel;
      this.value = value;
      this.type = type;
      this.percentage = percentage;
    }
  
    static fromJson(json: Solicitud): Request {
      return new Request(json.descripcionEmbudo, json.valor, json.tipo, {
        value: json.porcentaje.valor,
        type: json.porcentaje.tipo,
        orientation: json.porcentaje.orientacion,
      });
    }
  }
  
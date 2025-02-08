export interface IRequestSheduledDetail {
    value: number;
    description: string;
    type: number;
  }
  
  export type SolicitudAgendada = {
    texto: string;
    numSolicitudes: number;
    tipo: number;
  };
  
  export class RequestSheduledDetail implements IRequestSheduledDetail {
    value: number;
    description: string;
    type: number;
  
    constructor(value: number, description: string, type: number) {
      this.description = description; 
      this.value = value; 
      this.type = type;
    }
  
    static fromJson(json: SolicitudAgendada): RequestSheduledDetail {
      return new RequestSheduledDetail(json.numSolicitudes, json.texto, json.tipo);
    }
  }
  
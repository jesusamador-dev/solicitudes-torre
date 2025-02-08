type SubFunnel = {
  idFunnel: number;
  funnelDescription: string;
  value: number;
  type: number;
  order: number;
};
export interface IFunnel {
  idFunnel: number;
  funnelDescription: string;
  value: number;
  type: number;
  order: number;
  subFunnels?: SubFunnel[];
}

export class Funnel implements IFunnel {
  idFunnel: number;
  funnelDescription: string;
  value: number;
  type: number;
  order: number;

  constructor(
    idFunnel: number,
    funnelDescription: string,
    value: number,
    type: number,
    order: number
  ) {
    this.idFunnel = idFunnel;
    this.funnelDescription = funnelDescription;
    this.value = value;
    this.type = type;
    this.order = order;
  }

  static fromJson(json: {
    idEmbudo: number;
    descripcionEmbudo: string;
    total: number;
    tipo: number;
    orden: number;
  }) {
    return {
      idFunnel: json.idEmbudo,
      funnelDescription: json.descripcionEmbudo,
      value: json.total,
      type: json.tipo,
      order: json.orden,
    };
  }
}

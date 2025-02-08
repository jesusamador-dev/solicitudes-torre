type ReencauceDetail = {
  description: string;
  value: number;
  type: number;
};

type ReencauceRaw = {
  total: number;
  detalle: {
    descripcion: string;
    subtotal: number;
    tipo: number;
  }[];
};

export interface IReencauce {
  value: number;
  details: ReencauceDetail[];
}

export class Reencauce implements IReencauce {
  
   value: number;
   details: ReencauceDetail[];
  constructor(
     value: number, 
     details: ReencauceDetail[]
  ) {
    this.value = value;
    this.details = details;
  }

  static fromJson(json: ReencauceRaw): Reencauce {
    const toDetails: ReencauceDetail[] = json.detalle.map((de) => ({
      description: de.descripcion,
      value: de.subtotal,
      type: de.tipo,
    }));

    return new Reencauce(json.total, toDetails);
  }
}

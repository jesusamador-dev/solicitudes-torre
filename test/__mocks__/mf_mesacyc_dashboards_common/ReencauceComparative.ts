interface ReencauceComparativaData {
  descripcion: string;
  total: number;
  detalle: {segmento: string; valor: number}[];
  tipo: string;
}

interface IReencauceComparative {
  description: string;
  value: number;
  details: {segment: string; value: number}[];
  type: string;
}

export interface IReencauceComparativeData {
  name: string;
  segments: string[];
  data: (number | null)[];
}

export class ReencauceComparative implements IReencauceComparativeData {
  name: string;
  data: (number | null)[];
  segments: string[];

  constructor(name: string, data: (number | null)[]) {
    this.name = name;
    this.data = data;
    this.segments = [];
  }

  private static convertData(data: ReencauceComparativaData[]): IReencauceComparative[] {
    const result: IReencauceComparative[] = [];
    data.map((element) => {
      const {descripcion, total, detalle, tipo} = element;
      result.push({
        description: descripcion,
        value: total,
        details: detalle.map((detail) => ({segment: detail.segmento, value: detail.valor})),
        type: tipo,
        
      });
    });

    return result;
  }

  static fromJson(json: ReencauceComparativaData[]): IReencauceComparativeData[] {
    const data = ReencauceComparative.convertData(json);
    const result: IReencauceComparativeData[] = [];
    for (const item of data) {
      const {description, details} = item;
      result.push({
        name: description,
        data: details.map(({value}) => (value !== 0 ? value : null)),
        segments: details.map(({segment}) => segment)
      });
    }
    return result;
  }
}

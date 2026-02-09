export interface JosekiMove {
  row: number;
  col: number;
  comment: string;
}

export interface JosekiSequence {
  name: string;
  description: string;
  moves: JosekiMove[];
}

export interface JosekiFamily {
  id: string;
  name: string;
  japaneseName: string;
  description: string;
  sequences: JosekiSequence[];
}

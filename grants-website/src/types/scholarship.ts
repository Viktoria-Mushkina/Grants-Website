export interface Scholarship {
  id: number;
  name: string;
  target: string;
  type: 'Государственная' | 'Негосударственная';
  conditions: string;
  category?: string;
}

export type ScholarshipType = Scholarship['type'];
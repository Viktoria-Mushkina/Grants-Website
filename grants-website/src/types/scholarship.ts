export type Scholarship = {
  id: number;
  name: string;
  target: string;
  shortTarget?: string;
  type: 'Государственная' | 'Негосударственная';
  conditions: string;
  category?: string;
  amount?: string;
}
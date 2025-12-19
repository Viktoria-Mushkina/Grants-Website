export interface Scholarship {
  id: number;
  name: string;
  target: string;
  type: "Государственная" | "Негосударственная";
  conditions: string;
  paymentAmount?: string;
  category?: string;
  
  // Новые поля как массивы строк
  description?: string;
  paymentFrequency?: string;
  paymentDuration?: string;
  educationLevel?: string[]; // Теперь массив строк
  course?: string[]; // Теперь массив строк
  department?: string[]; // Теперь массив строк
  studyForm?: string[];
  
  requirements?: {
    minGrade?: string;
    noDebts?: boolean;
    achievements?: string[];
  };
  
  contacts?: {
    name?: string;
    position?: string;
    email?: string;
    phone?: string;
  };
  
  additionalInfo?: {
    deadline?: string;
    documents?: string;
    selectionType?: string;
    places?: string;
  };
  
  procedure?: string[];
  detailsUrl?: string;
}
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  translations: {
    [key: string]: {
      question: string;
      answer: string;
    };
  };
  created_at: string;
  updated_at: string;
}

export type Language = 'en' | 'hi' | 'bn';

export interface FAQFormData {
  question: string;
  answer: string;
}
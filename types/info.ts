export interface Faq {
  id: number;
  uuid: string;
  active: boolean;
  translation: {
    locale: string;
    id: number;
    question: string;
    answer: string;
  } | null;
}

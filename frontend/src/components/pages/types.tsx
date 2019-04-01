export interface FormState {
  data: {
    email: string;
    password: string;
  };
  errors: {
    server: string;
    email: string;
    password: string;
  };
}

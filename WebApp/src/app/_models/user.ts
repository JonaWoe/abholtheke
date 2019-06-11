export class User {
  id: string;
  insuranceId: string;
  eMail: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  role: number;
}

export class GoogleUser {
  id: string;
  insuranceId: string;
  googleId: string;
  eMail: string;
  firstName: string;
  lastName: string;
  googleIdToken: string;
  token: string;
  role: number;
}

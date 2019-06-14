export class User {
  // tslint:disable-next-line:variable-name
  _id: string;
  insuranceId: string;
  eMail: string;
  password: string;
  firstName: string;
  lastName: string;
  token: string;
  role: number;
}

export class GoogleUser {
  // tslint:disable-next-line:variable-name
  _id: string;
  insuranceId: string;
  googleId: string;
  eMail: string;
  firstName: string;
  lastName: string;
  googleIdToken: string;
  token: string;
  role: number;
}

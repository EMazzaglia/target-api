export interface ISignInInput {
  email: string;
  password: string;
}

export interface IComparePasswordInput {
  password: string;
  userPassword: string;
}

export interface ITokenToBlacklistInput {
  email: string;
  token: string;
}

export interface ITokenPayload {
  data: TokenPayloadData;
  iat: number;
  exp: number;
}

export interface IValidateUser {
  id: number;
  token: string;
}

type TokenPayloadData = {
  userId: number;
  email: string;
};

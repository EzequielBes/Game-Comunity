import { jwtDecode } from "jwt-decode";

export const decodeJwtToken =  (token: string) => {
  try {
    const decoded =  jwtDecode(token);
    return decoded;
  } catch (err) {
    console.error("Token inválido", err);
    return null;
  }
};

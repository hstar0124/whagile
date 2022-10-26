import jwt_decode from "jwt-decode";

export function decodeJwt(token) {
    return jwt_decode(token);
};

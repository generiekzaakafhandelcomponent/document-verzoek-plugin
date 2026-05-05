// Base64URL encode (no padding, URL-safe)
function base64url(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export function generateOpenZaakJwt(request) {
    const header = {"alg": "HS256", "typ": "JWT"};
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        "iss": request.environment.get("CLIENT_ID"),
        "iat": now,
        "client_id": request.environment.get("CLIENT_ID"),
        "user_id": request.environment.get("USER_ID"),
        "user_representation": request.environment.get("USER_REPRESENTATION")
    };

    const headerB64 = base64url(JSON.stringify(header));
    const payloadB64 = base64url(JSON.stringify(payload));
    const unsigned = headerB64 + "." + payloadB64;

    const secret = request.environment.get("SECRET");
    const signatureBase64 = crypto.hmac.sha256()
        .withTextSecret(secret)
        .updateWithText(unsigned)
        .digest()
        .toBase64();

    // Convert Base64 to Base64URL
    const signature = signatureBase64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

    return unsigned + "." + signature;
}
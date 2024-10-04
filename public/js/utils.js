function jwtDecodeAndValidate(t) {
    if (!t) {
        return { valid: false, error: 'No token provided' };
    }

    try {
        let token = {
            raw: t,
            header: JSON.parse(atob(t.split('.')[0])),
            payload: JSON.parse(atob(t.split('.')[1]))
        };

        const currentTime = Math.floor(Date.now() / 1000);
        
        if (token.payload.exp && token.payload.exp < currentTime) {
            token.valid = false;
            token.error = 'Token has expired';
        } else if (token.payload.nbf && token.payload.nbf > currentTime) {
            token.valid = false;
            token.error = 'Token is not yet valid';
        } else {
            token.valid = true;
        }

        return token;
    } catch (error) {
        return { valid: false, error: 'Invalid token format' };
    }
}
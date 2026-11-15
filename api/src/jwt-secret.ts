/** Never sign or trust sessions with a public fallback signing key. */
export function getJwtSecret(value: string | undefined = process.env.JWT_SECRET): string {
    if (!value || value.trim().length < 32 || value === 'your-secret-key-change-in-production') {
        throw new Error('JWT_SECRET must be configured with at least 32 characters');
    }
    return value;
}

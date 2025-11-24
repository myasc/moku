import { UserProfile } from "./types";

/**
 * Encodes a UserProfile into a URL-safe base64 string.
 * We only encode essential data to keep the string short.
 */
export function encodeProfile(profile: UserProfile): string {
    // Create a minified version of the profile to save space
    const minified = {
        n: profile.name,
        d: profile.dob,
        g: profile.gender,
        s: profile.scores
    };

    try {
        const json = JSON.stringify(minified);
        // Encode to base64
        const base64 = btoa(json);
        // Make URL safe
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
        console.error("Error encoding profile:", e);
        return "";
    }
}

/**
 * Decodes a URL-safe base64 string back into a UserProfile.
 */
export function decodeProfile(encoded: string): UserProfile | null {
    try {
        // Restore base64 standard characters
        let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
        // Add padding if needed
        while (base64.length % 4) {
            base64 += '=';
        }

        const json = atob(base64);
        const minified = JSON.parse(json);

        // Reconstruct full UserProfile
        return {
            name: minified.n,
            dob: minified.d,
            gender: minified.g,
            scores: minified.s
        };
    } catch (e) {
        console.error("Error decoding profile:", e);
        return null;
    }
}

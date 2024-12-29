export function getCookie(name) {
    const cookieArray = document.cookie.split("; ");
    for (const cookie of cookieArray) {
        const [key, value] = cookie.split("=");
        if (key === name) return value;
    }
    return null; // Return null if the cookie is not found
}
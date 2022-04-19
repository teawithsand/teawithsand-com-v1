export const loadAndRegisterServiceWorker = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
        try {
            const v = (document.getElementById("wwswpd") as any).value
            if(!v)
                throw new Error("No path for SW to initialize!");
            const registration = await navigator.serviceWorker.register(v);
        } catch (registrationError) {
            console.error('SW registration failed: ', registrationError);
        }
    }
    return Promise.resolve()
}
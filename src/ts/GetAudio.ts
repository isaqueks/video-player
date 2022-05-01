
export default function GetAudio(src: string): HTMLAudioElement {
    if (!process.browser) {
        return {} as any;
    }
    return new Audio(src);
}
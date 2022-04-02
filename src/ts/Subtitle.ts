import SubtitleFragment from "./SubtitleFragment";

export default abstract class Subtitle {
    
    constructor(
        public readonly src: string,
        public readonly language: string,
        public readonly name: string
    ) {}

    public abstract get isParsed(): boolean;

    public abstract parse(): Promise<void>;

    public abstract getTextAt(time: number): SubtitleFragment;

}
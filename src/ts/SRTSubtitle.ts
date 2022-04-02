import Subtitle from "./Subtitle";
import srt from 'srt-parser-2';

interface SRTFragment {
    id: string;
    startTime: number;
    endTime: number;
    text: string;
}

export default class SRTSubtitle extends Subtitle {

    private parsed: SRTFragment[];

    private parseTime(time: string): number {
        const msDivider = time.includes('.') ? '.' : ',';
        const [hours, minutes, secondsMS] = time.split(':');
        const [ seconds, milliseconds ] = secondsMS.split(msDivider);

        return Number(hours) * 3600 * 1000 + Number(minutes) * 60 * 1000 + Number(seconds) * 1000 + Number(milliseconds);
    }

    // React is safe against XSS attacks, 
    // but the HTML tags can be anoying to read.
    private removeTags(text: string): string {
        return text.replace(/<[^>]*>/g, '');
    }

    public async parse(): Promise<void> {
        const res = await fetch(this.src);
        if (res.status < 200 || res.status > 299) {
            throw new Error(`Failed to fetch subtitle: ${res.status}`);
        }

        const text = await res.text();
        const parser = new srt();

        const subtitles = parser.fromSrt(text)
        .map(raw => {

            const start = this.parseTime(raw.startTime);
            const end = this.parseTime(raw.endTime);

            return {
                id: raw.id,
                startTime: start,
                endTime: end,
                text: this.removeTags(raw.text)
            }

        });

        this.parsed = subtitles;
    }

    public getTextAt(time: number) {
        if (!this.parsed) {
            throw new Error('Subtitle not parsed yet');
        }

        const fragment = this.parsed.find(fragment => {
            return fragment.startTime <= time && fragment.endTime >= time;
        });

        if (!fragment) {
            return null;
        }

        return {
            text: fragment.text,
            end: fragment.endTime,
            start: fragment.startTime
        }
    }

    public get isParsed(): boolean {
        return !!this.parsed;
    }

}
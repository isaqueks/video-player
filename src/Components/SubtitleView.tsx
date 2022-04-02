import style from '@Styles/SubtitleView.module.css';
import Subtitle from '@ts/Subtitle';

interface Props {
    time: number;
    subtitle: Subtitle;
    bottom: string;
}

export default function SubtitleView(props: Props) {

    const { time, subtitle } = props;

    let text = '';
    if (subtitle?.isParsed) {
        const item = subtitle.getTextAt(time * 1000);
        if (item) {
            text = item.text;
        }
    }

    const inline = {
        marginBottom: props.bottom,
    }

    return (
        <div className={style.subtitle}>
            <div className={style.text}>
                <span style={inline}>{text}</span>
            </div>
        </div>
    );

}
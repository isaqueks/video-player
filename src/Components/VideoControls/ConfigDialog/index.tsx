import style from '@Styles/VideoControls/ConfigDialog/index.module.css'
import Subtitle from '@ts/Subtitle'

interface Props {
    selectedSubtitle: Subtitle;
    subtitles: Subtitle[];
    currentSpeed: number;
    mobile?: boolean;

    onSelectSubtitle: (subtitle: Subtitle) => void;
    onChangeSpeed: (speed: number) => void;
    onClose: () => void;
}

interface FieldProps {
    title: string;
    options: { value: any, text: string }[];
    value: any;
    onChange: (value: any) => void;
}

function Field(props: FieldProps) {

    const onChange = e => {
        const val = e.target.value;
        const current = props.options.find(o => o.text == val)?.value;

        console.log(current);

        props.onChange(current);
    }

    const currVal = props.options.find(o => o.value == props.value)?.text;

    return (
        <div className={style.field}>
            <div className={style.fieldTitle}>{props.title}</div>
            <select className={style.input} defaultValue={currVal} onChange={onChange}>
                {props.options.map(option => {
                    return (<option key={option.text} value={option.text}>{option.text}</option>)
                })}
            </select>
        </div>
    )
}

export default function ConfigDialog(props: Props) {

    const speeds = [
        { value: 1, text: '1x' },
        { value: 1.25, text: '1.25x' },
        { value: 1.5, text: '1.5x' },
        { value: 1.75, text: '1.75x' },
        { value: 2, text: '2x' },
    ]

    const subtitles = [
        { value: null, text: 'Sem legenda' },
        ...props.subtitles.map(subtitle => {
            return {
                value: subtitle,
                text: subtitle.name
            }
        })
    ]

    return (
        <div className={`${style.configDialog} ${props.mobile ? style.mobile : ''}`} onClick={e => e.stopPropagation()}>
            {props.mobile &&
                <div className={style.header}>
                    <div className={style.closeBtn} onClick={e => props.onClose()} />
                </div>}
            <Field onChange={speed => props.onChangeSpeed(speed)} title="Velocidade" options={speeds} value={props.currentSpeed} />
            <Field onChange={sub => props.onSelectSubtitle(sub)} title="Legenda" options={subtitles} value={props.selectedSubtitle} />
        </div>
    );

}
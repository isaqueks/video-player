import style from '@Styles/VideoControls/TrackBar.module.css';

interface Props {
    duration: number;
    currentTime: number;
    onSeek: (time: number) => void;
}

export default function VideoTrackBar(props: Props) {

    const WATCHED_COLOR = 'red';
    const UNWATCHED_COLOR = 'rgb(200, 200, 200)';

    const percentage = (props.currentTime / props.duration) * 100;
    const bg = `linear-gradient(to right, ${WATCHED_COLOR} 0%, ${WATCHED_COLOR} ${percentage}%, ${UNWATCHED_COLOR} ${percentage}%, ${UNWATCHED_COLOR} 100%)`

    const inline = {
        background: bg
    }

    return (
        <div className={style.trackBar}>
            <input
                className={style.trackBarControl}
                type="range" 
                min={0} 
                max={props.duration} 
                value={props.currentTime}
                style={inline}
                onChange={e => props.onSeek(parseInt(e.target.value))}
            />
        </div>
    );

}
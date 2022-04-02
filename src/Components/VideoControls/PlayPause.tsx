import style from '@Styles/VideoControls/PlayPause.module.css'

interface Props {
    isPlaying: boolean;
    onPlay: () => void;
    onPause: () => void;
}

export default function PlayPause(props: Props) {
    const { isPlaying, onPlay, onPause } = props;
    return (
        <div className={`${style.playPause} ${isPlaying ? style.playing : style.paused}`} onClick={isPlaying ? onPause : onPlay} />
    );
}
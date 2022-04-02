import style from '@Styles/VideoPlayer.module.css';
import AudioTrack from '@ts/AudioTrack';
import Subtitle from '@ts/Subtitle';
import { useEffect, useRef, useState } from 'react';
import SubtitleView from './SubtitleView';
import VideoControls from './VideoControls';

interface Props {
    src: string;
    type: string;
    tracks: AudioTrack[];
    subtitles: Subtitle[];
}

export default function VideoPlayer(props: Props) {

    const video = useRef<HTMLVideoElement>(null);
    const videoWrapper = useRef<HTMLDivElement>(null);

    const [isPaused, setIsPaused] = useState(true);
    const [time, setTime] = useState(video?.current?.currentTime || 0);
    const [volume, setVolume] = useState(video?.current?.volume || 100);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [subtitle, setSubtitle] = useState<Subtitle>(null);
    const [speed, setSpeed] = useState<number>(1);

    // just to "fix" an object at memory
    const [wrapper] = useState({ timeout: null });

    const showControls = () => {
        setControlsVisible(true);
        if (wrapper.timeout) {
            clearTimeout(wrapper.timeout);
        }
        wrapper.timeout = (setTimeout(() => setControlsVisible(false), 2500));
    }

    const pause = (force: boolean = false) => {
        const { current } = video;

        if (!force && current.paused) {
            return;
        }
        current.pause();
        showControls();
        setIsPaused(true);
    }

    const play = (force: boolean = false) => {
        const { current } = video;

        if (!force && !current.paused) {
            return;
        }
        current.play();
        showControls();
        setIsPaused(false);
    }

    const seek = (time: number) => {
        video.current.currentTime = time;
        setTime(time);
    }

    const setVideoVolume = (volume: number) => {
        video.current.volume = volume / 100;
        setVolume(volume);
    }

    const setVideoSpeed = (speed: number) => {
        video.current.playbackRate = speed;
        setSpeed(speed);
    }

    const setVideoSubtitle = (subtitle: Subtitle) => {
        subtitle.parse();
        setSubtitle(subtitle);
    }

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            videoWrapper.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    useEffect(() => {
        const handler = setInterval(() => {
            if (time !== video?.current?.currentTime) {
                setTime(video?.current?.currentTime || 0);
            }
        }, 250);

        return () => clearInterval(handler);
    });

    return (
        <div 
            ref={videoWrapper} 
            className={style.videoPlayer}
            onMouseMove={() => showControls()}
        >
            <video
                ref={video}
                className={style.videoElement}
                onPause={() => pause(true)}
                onPlay={() => play(true)}
                onStalled={() => pause(true)}
                controls={false}
            >
                <source type={props.type} src={props.src} />
            </video>
            <SubtitleView bottom={(controlsVisible || isPaused) ? '70px' : '10px'} subtitle={subtitle} time={time} />
            <div className={style.controlsWrapper}>
                <VideoControls
                    isPlaying={!isPaused}
                    duration={video?.current?.duration || 0}
                    currentTime={time}
                    volume={volume}
                    visible={isPaused || controlsVisible}
                    speed={speed}
                    selectedSubtitle={subtitle}
                    subtitles={props.subtitles}

                    onSeek={n => seek(n)}
                    onSetVolume={n => setVideoVolume(n)}
                    onPlay={() => play()}
                    onPause={() => pause()}
                    onChangeFullscreen={() => toggleFullScreen()}
                    onChangeSpeed={n => setVideoSpeed(n)}
                    onSelectSubtitle={n => setVideoSubtitle(n)}
                />
            </div>
        </div>
    );
}
import style from '@Styles/VideoPlayer.module.css';
import AudioTrack from '@ts/AudioTrack';
import GetAudio from '@ts/GetAudio';
import isMobile from '@ts/IsMobile';
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

const SYNC_INTERVAL = 250;
const STATE_LOADED = 4;

export default function VideoPlayer(props: Props) {

    const video = useRef<HTMLVideoElement>(null);
    const videoWrapper = useRef<HTMLDivElement>(null);

    const [ isPaused, setIsPaused ] = useState(true);
    const [ isLoading, setIsLoading ] = useState(true);

    const [ time, setTime ] = useState(video?.current?.currentTime || 0);
    const [ controlsVisible, setControlsVisible ] = useState(true);
    const [ subtitle, setSubtitle ] = useState<Subtitle>(null);
    const [ speed, setSpeed ] = useState<number>(1);
    const [ mobile, setMobile ] = useState(false);
    const [ src, setSrc ] = useState(props.src);
    const [ audio, setAudio ] = useState<HTMLAudioElement>(GetAudio(props.tracks?.[0]?.src || props.src));
    const [ volume, setVolume ] = useState((audio?.volume||1) * 100);

    // just to "fix" an object at memory
    const [ wrapper ] = useState({ timeout: null });

    const setAudioSrc = (src: string) => {
        if (audio.src !== src) {
            setAudio(GetAudio(src));
        }
    }

    const showControls = () => {
        setControlsVisible(true);
        if (wrapper.timeout) {
            clearTimeout(wrapper.timeout);
        }
        wrapper.timeout = (setTimeout(() => setControlsVisible(false), 2500));
    }

    const pause = (force: boolean = false) => {
        const { current } = video;

        audio.pause();

        if (!force && current.paused) {
            return;
        }
        current.pause();
        showControls();
        setIsPaused(true);
    }

    const play = (force: boolean = false) => {
        const { current } = video;

        audio.play();

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
        const vol = volume / 100;
        if (Math.abs(audio.volume - vol) <= 0.01) {
            return;
        }
        audio.volume = vol;
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

    const bannerClick = () => {
        if (isPaused) {
            play();
        }
        else {
            if (mobile) {
                if (controlsVisible) {
                    return pause();
                }
                return setControlsVisible(true);
            }
            pause();
        }
    }

    useEffect(() => {
        const reallyIsMobile = isMobile();
        if (mobile !== reallyIsMobile) {
            setMobile(reallyIsMobile);
        }
        const syncVideoAndAudioHandler = setInterval(() => {
            
            if (video?.current && audio && !isPaused && Math.abs(audio.currentTime - video.current.currentTime) > 0.5) {
                audio.currentTime = video.current.currentTime;
            }

            if (time !== video?.current?.currentTime) {
                setTime(video?.current?.currentTime || 0);
            }
            if (props.src !== src) {
                pause();
                setSrc(props.src);
                seek(0);
            }
        }, SYNC_INTERVAL);

        let orientationHandler;

        if (mobile) {
            orientationHandler = () => {
                const horizontal = !(window.orientation === 0 || window.orientation === 180);
                console.log({ horizontal });
                
                if (horizontal) {
                    if (!document.fullscreenElement) {
                        toggleFullScreen();
                    }
                }
                else {
                    if (document.fullscreenElement) {
                        toggleFullScreen();
                    }
                }
            }
            window.addEventListener('orientationchange', orientationHandler);
        }

        const checkLoadingHandler = setInterval(() => {
            const loading = (video?.current?.readyState || 0) < STATE_LOADED;

            if (loading !== isLoading) {
                setIsLoading(loading);
            }

        }, SYNC_INTERVAL);

        return () => {
            clearInterval(syncVideoAndAudioHandler);
            clearInterval(checkLoadingHandler);
            orientationHandler && window.removeEventListener('orientationchange', orientationHandler);
        }
    });

    return (
        <div 
            ref={videoWrapper} 
            className={`${style.videoPlayer} ${mobile ? style.mobile : ''}`}
            onMouseMove={() => showControls()}
            key={src}
        >
            <video
                ref={video}
                className={style.videoElement}
                onPause={() => pause(true)}
                onPlay={() => play(true)}
                onStalled={() => false && pause(true)}
                controls={false}
                muted={true}
            >
                <source type={props.type} src={src} />
            </video>
            <SubtitleView bottom={(controlsVisible || isPaused) ? '70px' : '15px'} subtitle={subtitle} time={time} />
            <div className={style.controlsWrapper}>
                <VideoControls
                    mobile={mobile}
                    isLoading={isLoading}
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
                    onBannerClick={() => bannerClick()}
                />
            </div>
        </div>
    );
}
import style from '@Styles/VideoControls/index.module.css'
import Subtitle from '@ts/Subtitle';
import { useState } from 'react';
import IconButton from '../IconButton';
import Padding from '../Padding';
import ConfigDialog from './ConfigDialog';
import PlayPause from './PlayPause';
import VideoTrackBar from './VideoTrackBar';
import VolumeControl from './VolumeControl';

interface Props {
    isPlaying: boolean;
    duration: number;
    currentTime: number;
    volume: number;
    visible: boolean;
    subtitles: Subtitle[];
    selectedSubtitle: Subtitle;
    speed: number;
    mobile: boolean;

    onPlay: () => void;
    onPause: () => void;
    onSeek: (time: number) => void;
    onSetVolume: (volume: number) => void;
    onChangeFullscreen: () => void;
    onChangeSpeed: (speed: number) => void;
    onSelectSubtitle: (subtitle: Subtitle) => void;
    onBannerClick: () => void;
}

export default function VideoControls(props: Props) {

    const { isPlaying, duration, currentTime, volume, speed, subtitles, selectedSubtitle, mobile } = props;
    const { onPlay, onPause, onSeek, onSetVolume, onChangeFullscreen, onChangeSpeed, onSelectSubtitle, onBannerClick } = props;

    const [ isDialogOpened, setDialogOpened ] = useState(false);

    const inline = {
        opacity: (props.visible || isDialogOpened) ? 1 : 0,
    }

    const bannerClick = () => {
        if (isDialogOpened) {
            return setDialogOpened(false);
        }

        onBannerClick();
    }

    return (
        <div className={style.videoControls.concat(mobile ? (' '+style.videoControlsMobile) : '')} style={inline}>
            <div className={style.screenControls} onClick={() => bannerClick()}>
                { isDialogOpened ? (
                    <Padding value="16px">
                        <ConfigDialog
                            selectedSubtitle={selectedSubtitle} 
                            subtitles={subtitles} 
                            currentSpeed={speed} 
                            onSelectSubtitle={sub => onSelectSubtitle(sub)} 
                            onChangeSpeed={speed => onChangeSpeed(speed)} />
                    </Padding>
                ) : <div className={style.bannerPlayPause}>
                    <PlayPause isPlaying={isPlaying} onPlay={() => onPlay()} onPause={() => onPause()} />
                </div> }
            </div>
            <div className={style.downControls.concat(mobile ? (' '+style.downControlsMobile) : '')}>
                <VideoTrackBar
                    duration={duration} 
                    currentTime={currentTime} 
                    onSeek={n => onSeek(n)}  
                />
                <div className={style.barControls.concat(mobile ? (' '+style.barControlsMobile) : '')}>
                    <div className={style.barControlsLeft}>
                        <Padding value="6px">
                            <PlayPause isPlaying={isPlaying} onPlay={() => onPlay()} onPause={() => onPause()} />
                        </Padding>
                        <VolumeControl current={volume} onSet={n => onSetVolume(n)} />
                    </div>
                    <div></div>
                    <div className={style.barControlsRight}>
                        <Padding value="2px 6px 2px 0px">
                            <IconButton src="/static/img/gear.png" onClick={() => setDialogOpened(!isDialogOpened)} />
                        </Padding>
                        <Padding value="2px 0px 2px 6px">
                            <IconButton src="/static/img/fullscreen.png" onClick={() => onChangeFullscreen()} />
                        </Padding>
                    </div>
                </div>
            </div>
        </div>
    );

}
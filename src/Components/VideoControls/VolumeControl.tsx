/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import style from '@Styles/VideoControls/VolumeControl.module.css';
import IconButton from '../IconButton';
import Padding from '../Padding';

interface Props {
    current: number;
    onSet: (time: number) => void;
}

export default function VolumeControl(props: Props) {

    const SET_COLOR = 'white';
    const UNSET_COLOR = 'rgba(180, 180, 180, 0.6)';

    const percentage = props.current;
    const bg = `linear-gradient(to right, ${SET_COLOR} 0%, ${SET_COLOR} ${percentage}%, ${UNSET_COLOR} ${percentage}%, ${UNSET_COLOR} 100%)`

    const inline = {
        background: bg
    }

    return (
        <div className={style.volumeControl}>
            <Padding value="6px">
                <IconButton src="/static/img/audio.png" />
            </Padding>
            <div className={style.trackContainer}>
                <input
                    className={style.volumeTrackBarControl}
                    type="range" 
                    min={0} 
                    max={100} 
                    value={props.current}
                    style={inline}
                    onChange={e => props.onSet(parseInt(e.target.value))}
                />
            </div>
        </div>
    );

}
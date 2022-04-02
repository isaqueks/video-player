
export default function IconButton(props) {

    const { src, children, ...other } = props;

    const inline = {
        backgroundImage: `url("${src}")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        cursor: props.cursor || 'pointer'
    }

    return (
        <div style={inline} {...other}>
            {children}
        </div>
    );
}
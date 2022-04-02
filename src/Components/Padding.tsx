
export default function Padding({ children, value }) {

    const inline = {
        padding: value
    }

    return (
        <div style={inline}>{children}</div>
    )
}
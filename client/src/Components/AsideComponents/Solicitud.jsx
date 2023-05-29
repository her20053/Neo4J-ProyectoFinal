export default function SolicitudAppComponent({ nombre }) {
    return (
        <div class="bubble">
            <img className="profile-image" src={"https://avatars.dicebear.com/api/bottts/" + nombre + ".svg"} alt="profile image" />
        </div>
    );
}
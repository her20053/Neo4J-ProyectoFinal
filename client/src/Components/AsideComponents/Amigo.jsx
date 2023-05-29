export default function AmigoAppComponent({ nombre }) {
    return (
        <div className="info__contacts__list__item">
            <div className="info__contacts__list__item__pic profile-status-image">
                <img className="profile-image" src={"https://avatars.dicebear.com/api/bottts/" + nombre + ".svg"} alt="profile image" />
            </div>
            {nombre}
        </div>
    );
}
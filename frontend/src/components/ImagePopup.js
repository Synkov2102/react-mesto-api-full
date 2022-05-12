import exitIconPath from "../images/form_exit-button.svg";

function ImagePopup(props) {

let isOpen = false

if (props.card.link != undefined) {
    isOpen = true
}

  return (
    <div className={`popup popup_for_image ${isOpen ? "popup_open" : ""}`}>
      <div className="popup__container">
        <button
          type="button"
          className="popup__exit-button"
          onClick={props.onClose}
        >
          <img
            className="popup__exit-button-image"
            src={exitIconPath}
            alt='Изображение кнопки "выйти"'
          />
        </button>
        <img
          className="popup__image"
          alt={"Картинка с карточки - " + props.card.name}
          src={props.card.link}
        />
        <p className="popup__subtitle">{props.card.name}</p>
      </div>
    </div>
  );
}

export default ImagePopup;

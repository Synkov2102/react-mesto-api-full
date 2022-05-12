import PopupWithForm from "./PopupWithForm";
import React from "react";

function EditAvatarPopup (props) {
    const avatarRef = React.useRef();

    function handleSubmit(e) {
        e.preventDefault();
        props.onUpdateAvatar(
          avatarRef.current.value,
        );
        props.onClose()
    }

    return (
    <PopupWithForm
        name={"avatarForm"}
        title={"Обновить аватар"}
        isOpen={props.isOpen}
        onClose={props.onClose}
        buttonName={"Сохранить"}
        onSubmit={handleSubmit}
      >
        <fieldset className="popup__text-inputs">
          <input
            id="url-avatar-input"
            required
            type="url"
            className="popup__input popup__input_type_link"
            placeholder="Ссылка на картинку"
            ref={avatarRef}
          />
          <span className="popup__input-error url-avatar-input-error"></span>
        </fieldset>
      </PopupWithForm>)
}
export default EditAvatarPopup
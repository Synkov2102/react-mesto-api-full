import PopupWithForm from "./PopupWithForm";
import React from "react";

function AddPlacePopup({onAddPlace, onClose, isOpen}) {
  const nameRef = React.useRef();
  const linkRef = React.useRef();

  React.useEffect(() => {
    nameRef.current.value='';
    linkRef.current.value='';
  },[isOpen]);

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlace(nameRef.current.value, linkRef.current.value);
    onClose();
  }

  return (
    <PopupWithForm
      name={"addForm"}
      title={"Новое место"}
      isOpen={isOpen}
      onClose={onClose}
      buttonName={"Создать"}
      onSubmit={handleSubmit}
    >
      <fieldset className="popup__text-inputs">
        <input
          id="title-input"
          required
          type="text"
          className="popup__input popup__input_type_title"
          placeholder="Название"
          minLength="2"
          maxLength="30"
          ref={nameRef}
        />
        <span className="popup__input-error title-input-error"></span>
        <input
          id="url-input"
          required
          type="url"
          className="popup__input popup__input_type_link"
          placeholder="Ссылка на картинку"
          ref={linkRef}
        />
        <span className="popup__input-error url-input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default AddPlacePopup;

import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import React from "react";

function EditProfilePopup (props) {
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');

    const currentUser = React.useContext(CurrentUserContext);
    // После загрузки текущего пользователя из API
    // его данные будут использованы в управляемых компонентах.
    React.useEffect(() => {
        setName(currentUser.name);
        setDescription(currentUser.about);
    },[props.isOpen]);
    

    function handleNameChange(e) {
        setName(e.target.value);
      }

    function handleDescriptionChange(e) {
        setDescription(e.target.value);
    }

    function handleSubmit(e) {
        // Запрещаем браузеру переходить по адресу формы
        e.preventDefault();
      
        // Передаём значения управляемых компонентов во внешний обработчик
        props.onUpdateUser(name, description);
        props.onClose()
    }

    return(
        <PopupWithForm
          name={"editForm"}
          title={"Редактировать профиль"}
          buttonName={"Сохранить"}
          onSubmit={handleSubmit}
          isOpen={props.isOpen}
          onClose={props.onClose}
        >
          <fieldset className="popup__text-inputs">
            <input
              id="name-input"
              required
              type="text"
              className="popup__input popup__input_type_name"
              placeholder="Имя"
              minLength="2"
              maxLength="40"
              value={name || ''}
              onChange={handleNameChange}
            />
            <span className="popup__input-error name-input-error"></span>
            <input
              id="profession-input"
              required
              type="text"
              className="popup__input popup__input_type_profession"
              placeholder="Род деятельности"
              minLength="2"
              maxLength="200"
              value={description || ''}
              onChange={handleDescriptionChange}
            />
            <span className="popup__input-error profession-input-error"></span>
          </fieldset>
        </PopupWithForm>
    )
}
export default EditProfilePopup
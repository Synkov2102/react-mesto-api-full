import React from "react";
import Card from "../components/Card";

import editIconPath from "../images/profile_edit-button.svg";
import addIconPath from "../images/profile_add-button.svg";
import penIconPath from "../images/profile_editlogo-icon.svg";

import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext)
  return (
    <main className="main">
      <section className="profile">
        <div className="profile__container">
          <div
            className="profile__avatar"
            style={{ backgroundImage: `url(${currentUser.avatar})` }}
            onClick={props.onEditAvatar}
          >
            <img
              className="profile__pen-icon"
              src={penIconPath}
              alt="Иконка редактирования аватарки"
            />
          </div>
          <div className="profile__info">
            <div className="profile__name-container">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button
                type="button"
                onClick={props.onEditProfile}
                className="profile__edit-button"
              >
                <img
                  className="profile__image-edit-button"
                  src={editIconPath}
                  alt='Изображение кнопки "редактировать"'
                />
              </button>
            </div>
            <p className="profile__profession">{currentUser.about}</p>
          </div>
        </div>
        <button
          type="button"
          className="profile__add-button"
          onClick={props.onAddPlace}
        >
          <img
            className="profile__image-add-button"
            src={addIconPath}
            alt='Изображение кнопки "добавить"'
          />
        </button>
      </section>
      <section className="elements">
        {props.cards.map((card) => {
          return (
            <Card key={card._id} card={card} onCardClick={props.onCardClick} onCardLike={props.onCardLike} onCardDelete={props.onCardDelete}/>
          );
        })}
      </section>
    </main>
  );
}

export default Main;

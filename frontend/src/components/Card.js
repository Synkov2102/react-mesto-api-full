import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext)
  const isOwn = props.card.owner === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `${isOwn ? 'element__delete-button' : 'element__delete-button_inactive'}`
  ); 

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = props.card.likes.some(i => i === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `element__like-button ${isLiked ? 'element__like-button_active' : ''}`
  ); ;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <div className="element">
      <button
        type="button"
        className="element__image-button"
        onClick={handleClick}
      >
        <img
          className="element__picture"
          alt={"Картинка элемента - " + props.card.name}
          src={props.card.link}
        />
      </button>
      <div className="element__container">
        <h2 className="element__title">{props.card.name}</h2>
        <div className="element__like-group">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="element__like-counter">{props.card.likes.length}</p>
        </div>
      </div>
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
    </div>
  );
}

export default Card;

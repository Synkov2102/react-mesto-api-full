import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import PopupWithForm from "./PopupWithForm";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ProtectedRoute from "./ProtectedRoute";

import api from "../utils/Api.js";
import auth from "../utils/Auth.js";

import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { Route, Link, useHistory } from "react-router-dom";
import AddPlacePopup from "./AddPlacePopup";
import Login from "./Login";
import Register from "./Register";

function App() {
  const history = useHistory();
  const [email, setEmail] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(true);
  const [status, setStatus] = React.useState(false);
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);

  React.useEffect(() => {
    if (loggedIn){
      api
      .getProfileInfo()
      .then((data) => {
        console.log(data)
        setCurrentUser(data.user);
      })
      .catch((err) => {
        console.log(err);
      });

    api
      .getCardsData()
      
      .then((data) => {
        setCards(data.cards);
      })
      .catch((err) => {
        console.log(err);
      });
    }
    tokenCheck()
  },[]);

  React.useEffect(() => {
    tokenCheck();
  },[history.location]);

  function tokenCheck() {
    // если у пользователя есть токен в localStorage,
    // эта функция проверит валидность токена
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      // проверим токен
      auth.checkToken(jwt).then((res) => {
        if (res) {
          setEmail(res.email);
          setLoggedIn(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      setLoggedIn(false);
    }
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(false);
    setIsInfoTooltipOpen(false);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(name, about) {
    api
      .patchProfileInfo(name, about)
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateAvatar(avatar) {
    api
      .patchAvatar(avatar)
      .then((data) => {
        setCurrentUser(data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    if (!isLiked) {
      api
        .makeLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard.card : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      api
        .deleteLike(card._id)
        .then((newCard) => {
          setCards((state) =>
            state.map((c) => (c._id === card._id ? newCard.card : c))
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function handleCardDelete(card) {
    api
      .deleteCardData(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleAddPlaceSubmit(name, link) {
    api
      .makeNewCardData(name, link)
      .then((newCard) => {
        setCards([newCard.card, ...cards]);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleLogOut() {
    localStorage.clear();
    setLoggedIn(false);
    history.push("./sign-in");
  }

  function handleLogin(email, password) {
    auth
      .getLogIn(email, password)
      .then((data) => {
        localStorage.setItem("jwt", data.token);
        setStatus(true);
        setIsInfoTooltipOpen(true);
        const jwt = localStorage.getItem("jwt");
        auth
          .checkToken(jwt)
          .then((res) => {
            if (res) {
              setEmail(res.email);
              setLoggedIn(true);
              setTimeout(() => {
                history.push("/");
                closeAllPopups()
              }, 1500)
            }
          })
      })
      .catch((err) => {
        setStatus(false);
        setIsInfoTooltipOpen(true);
        console.log(err);
      });
  }

  function handleRegister(email, password) {
    auth
      .getRegister(email, password)
      .then(() => {
        setStatus(true);
      })
      .catch((err) => {
        setStatus(false);
        console.log(err);
      })
      .finally(() => {
        setIsInfoTooltipOpen(true);
        setTimeout(() => {
          history.push("/sign-in");
          closeAllPopups()
        }, 1500);
        
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
          component={Header}
          handleLoggedIn={setLoggedIn}
          child={
            <div className="header__nav-container">
              <p className="header__text">{email}</p>
              <a className="header__link" onClick={handleLogOut}>
                Выйти
              </a>
            </div>
          }
        />
        <ProtectedRoute
          path="/"
          loggedIn={loggedIn}
          component={Main}
          onCardClick={handleCardClick}
          onAddPlace={handleAddPlaceClick}
          onEditProfile={handleEditProfileClick}
          onEditAvatar={handleEditAvatarClick}
          cards={cards}
          onCardLike={handleCardLike}
          onCardDelete={handleCardDelete}
        />
        <Route path="/sign-in">
          <Header
            child={
              <Link to="./sign-up" className="header__link">
                Регистрация
              </Link>
            }
          />
          <Login
            onLogin={handleLogin}
            status={status}
            isInfoOpen={isInfoTooltipOpen}
            onClosePopup={closeAllPopups}
          />
        </Route>
        <Route path="/sign-up">
          <Header
            child={
              <Link to="./sign-in" className="header__link">
                Войти
              </Link>
            }
          />
          <Register
            onRegister={handleRegister}
            status={status}
            isInfoOpen={isInfoTooltipOpen}
            closeAllPopups={closeAllPopups}
          />
        </Route>
        <Footer />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <PopupWithForm
          name={"editForm"}
          title={"Вы уверены?"}
          isOpen={false}
          onClose={closeAllPopups}
          buttonName={"Да"}
        ></PopupWithForm>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;

import React from "react";

import InfoTooltip from "./InfoTooltip";

function EnterForm({
  email,
  password,
  setEmail,
  setPassword,
  title,
  buttonName,
  onSubmit,
}){

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  return (
    <>
      <section className="login">
        <h2 className="login__title">{title}</h2>
        <form onSubmit={onSubmit}>
          <fieldset className="login__inputs">
            <input
              id="email-input"
              required
              type="email"
              className="login__input"
              placeholder="Email"
              minLength="2"
              maxLength="40"
              value={email || ""}
              onChange={handleEmailChange}
            />
            <input
              id="password-input"
              required
              type="password"
              className="login__input"
              placeholder="Пароль"
              minLength="2"
              maxLength="200"
              value={password || ""}
              onChange={handlePasswordChange}
            />
            <span className="login__text">text</span>
          </fieldset>
          <button className="login__button">{buttonName}</button>
        </form>
      </section>
    </>
  );
}

export default EnterForm;

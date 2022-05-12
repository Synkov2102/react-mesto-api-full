import EnterForm from "./EnterForm";
import React from "react";
import InfoTooltip from "./InfoTooltip";

function Login({ onLogin, status, isInfoOpen, onClosePopup}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit(e) {
    e.preventDefault();
    onLogin(email, password);
  }

  return (
    <>
      <EnterForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        title={"Вход"}
        buttonName={"Войти"}
        onSubmit={handleSubmit}
      />
      <InfoTooltip
        isOpen={isInfoOpen}
        onClose={onClosePopup}
        status={status}
        confirmText={"Вы успешно вошли!"}
      />
    </>
  );
}

export default Login;

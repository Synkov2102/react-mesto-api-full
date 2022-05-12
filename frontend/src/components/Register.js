import EnterForm from "./EnterForm";
import InfoTooltip from "./InfoTooltip";
import React from "react";

function Register({onRegister, status, isInfoOpen, onClosePopup}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  function handleSubmit(e){
    e.preventDefault();
    onRegister(email, password)
  }

  return (
    <>
      <EnterForm
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        title={"Регистрация"}
        buttonName={"Зарегистрироваться"}
        onSubmit={handleSubmit}
      />
      <InfoTooltip
        isOpen={isInfoOpen}
        onClose={onClosePopup}
        status={status}
        confirmText={"Вы успешно зарегисттрировались!"}
      />
    </>
  );
}

export default Register;

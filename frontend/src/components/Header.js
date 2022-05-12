import logoPath from "../images/header_logo.svg";

function Header({child}) {

  return (
    <header className="header">
      <img className="header__logo" src={logoPath} alt="Логотип Место" />
      {child}
    </header>
  );
}

export default Header;

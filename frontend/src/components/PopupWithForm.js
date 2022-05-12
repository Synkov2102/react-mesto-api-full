import exitIconPath from '../images/form_exit-button.svg';

function PopupWithForm (props){
    return (
        <div className = {`popup ${props.isOpen ? 'popup_open' : ''}`}>
            <div className="popup__container">
                <form className="popup__form" name={props.name} onSubmit={props.onSubmit}>
                    <button type="button" onClick={props.onClose} className="popup__exit-button">
                        <img className="popup__exit-button-image" src={exitIconPath}
                        alt='Изображение кнопки "выйти"'/>
                    </button>
                    <h2 className="popup__title">{props.title}</h2>
                    {props.children}
                    <button className="popup__button popup__button-submit">{props.buttonName}</button>
                </form>
            </div>
        </div>
    )
}

export default PopupWithForm;
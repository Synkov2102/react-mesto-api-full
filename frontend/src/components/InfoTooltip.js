import confirmImgPath from "../images/login-confirm.svg"
import rejectImgPath from "../images/login-reject.svg"
import exitIconPath from '../images/form_exit-button.svg';

function InfoTooltip (props){
    return (
        <div className = {`popup ${props.isOpen ? 'popup_open' : ''}`}>
            <div className="popup__container">
                <form className="popup__form">
                <button type="button" onClick={props.onClose} className="popup__exit-button">
                        <img className="popup__exit-button-image" src={exitIconPath}
                        alt='Изображение кнопки "выйти"'/>
                    </button>
                    <img className="popup__status-img" src={props.status ? confirmImgPath : rejectImgPath} alt="Изображение статуса отправки формы" />
                    <p className="popup__text">{props.status ? props.confirmText : "Что-то пошло не так! Попробуйте еще раз."}</p>
                </form>
            </div>
        </div>
    )
}

export default InfoTooltip;
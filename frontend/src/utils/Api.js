class Api {
    constructor ({baseUrl, token}) {
        this._baseUrl = baseUrl;
        this._token = token;
    }

    _getResponseData(res) {
        if (!res.ok) {
            return Promise.reject(`Ошибка: ${res.status}`);
        }
        return res.json()
    }
    
    _getToken = () => {
        return `Bearer ${localStorage.getItem('jwt')}`;
    }

    getProfileInfo () {
        return fetch(`${this._baseUrl}/users/me`, {
        headers: {
            "Authorization": this._getToken()}
        })
        .then(res => this._getResponseData(res))
            
    }

    patchProfileInfo (newName, newAbout) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {
                "Authorization": this._getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newName,
                about: newAbout
            })
        })
        .then(res=> this._getResponseData(res))
    }

    getCardsData () {
        return fetch(`${this._baseUrl}/cards`, {
        headers: {
            "Authorization": this._getToken(),}
        })
        .then(res => this._getResponseData(res))
    }

    makeNewCardData (name, link) {
        return fetch(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {
                "Authorization": this._getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                link: link
            })
        })
        .then(res => this._getResponseData(res))
    }

    deleteCardData (cardId) {
       return fetch(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": this._getToken(),
            }
        })
        .then(res => this._getResponseData(res))
    }

    makeLike (cardId) {
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'PUT',
            headers: {
                "Authorization": this._getToken(),
            }
        })
        .then(res => this._getResponseData(res))
    }

    deleteLike(cardId){
        return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: 'DELETE',
            headers: {
                "Authorization": this._getToken(),
            }
        })
        .then(res => this._getResponseData(res))
    }

    patchAvatar(link , token){
        return fetch(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                "Authorization": this._getToken(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                avatar: link
              })
        })
        .then(res => this._getResponseData(res))
    }
}
const baseUrl = 'api.synkov.students.nomoredomains.xyz' || 'http://localhost:3000';
const api = new Api({
    baseUrl: baseUrl ,
  }
);

export default api;
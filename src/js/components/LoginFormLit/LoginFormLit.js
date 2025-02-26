import { LitElement, html,} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import { getAPIData, API_PORT } from '../../index.js'
import output from '../../../css/output.css' with {type: 'css'}

const TEMPLATE = {
  id: 'loginFormTemplate',
  url: './js/components/LoginForm/LoginForm.html'
}
// Wait for template to load
//await importTemplate(TEMPLATE.url);

export class LoginFormLit extends LitElement {
  static styles = [output];

  static properties = {
    prueba: {type: String},
    email: {type: String},
    password: {type: String}
  };


  constructor() {
    super();
    this.email = ''
    this.password = ''
  }

  render() {

    return html`
      <form id="login-form" @submit="${this._onLoginSubmit}" enctype="multipart/form-data" class="space-y-4">
                <div class="flex flex-col">
                    <label for="login-email" class="text-gray-700 font-semibold">Email</label>
                    <input id="login-email" type="email" name="email" placeholder="a@a.a" .value=${this.email} @input="${this._emailChanged}" 
                        class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                </div>
                <div class="flex flex-col">
                    <label for="login-password" class="text-gray-700 font-semibold">Contraseña</label>
                    <input id="login-password" type="password" name="password"
                        class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400" .value=${this.password} @input="${this._passwordChanged}">
                </div>
                <button type="submit"
                    class="w-full bg-amber-500 text-white font-bold py-2 rounded-lg hover:bg-amber-600 transition duration-300" id="loginButton" title="Login" ?disabled=${this.email === '' || this.password === ''}>
                    Enviar
                </button>
            </form>
    `

  }

  _emailChanged(e) {
    this.email = e.target.value
  }

  _passwordChanged(e) {
    this.password = e.target.value
  }

  async _onLoginSubmit(e){
          e.preventDefault()
  
          const loginCredentials = {
              email: this.email,
              password: this.password
          }
  
          let onFormSubmitEvent
  
          if (loginCredentials.email !== '' && loginCredentials.password !== '') {
              const payload = JSON.stringify(loginCredentials)
              const apiData = await getAPIData(`${location.protocol}//${location.hostname}${API_PORT}/api/login`, 'POST', payload)
              onFormSubmitEvent = new CustomEvent("login-form-submit", {
                  bubbles: true,
                  detail: apiData
                })
              } else {
                  onFormSubmitEvent = new CustomEvent("login-form-submit", {
                    bubbles: true,
                    detail: null
                  })
                }
  
          this.dispatchEvent(onFormSubmitEvent);
      }
}

customElements.define('login-formo', LoginFormLit);
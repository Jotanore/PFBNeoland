import { getAPIData, API_PORT } from '../../index.js';
import output from '../../../css/output.css' with {type: 'css'}
/**
 * Login Form Web Component
 *
 * @class LoginForm
 * @emits 'login-form-submit'
 */
export class LoginForm extends HTMLElement {
  
    constructor() {
      // Always call super first in constructor
      super();
    }
  
    connectedCallback() {
        console.log("Custom element added to page.");
        const shadow = this.attachShadow({ mode: "open" });
        const style = document.createElement("style");
        shadow.adoptedStyleSheets.push(output);

    shadow.innerHTML = `
    <form id="login-form" action="#" enctype="multipart/form-data" class="space-y-4">
                <div class="flex flex-col">
                    <label for="login-email" class="text-gray-700 font-semibold">Email</label>
                    <input id="login-email" type="email" name="email" placeholder="a@a.a" 
                        class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                </div>
                <div class="flex flex-col">
                    <label for="login-password" class="text-gray-700 font-semibold">Contraseña</label>
                    <input id="login-password" type="password" name="password"
                        class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
                </div>
                <button type="submit"
                    class="w-full bg-amber-500 text-white font-bold py-2 rounded-lg hover:bg-amber-600 transition duration-300">
                    Enviar
                </button>
            </form>
    `

    shadow.appendChild(style);

    const form = shadow.getElementById("login-form");

    form.addEventListener("submit", this.onLoginSubmit.bind(this));
    }
  
    disconnectedCallback() {
      console.log("Custom element removed from page.");
    }
  
    adoptedCallback() {
      console.log("Custom element moved to new page.");
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(`Attribute ${name} has changed.`, oldValue, newValue);
    }

    //private methods

    async onLoginSubmit(e){
        e.preventDefault()

        const loginCredentials = {
            email: this.shadowRoot.getElementById('login-email').value,
            password: this.shadowRoot.getElementById('login-password').value
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
  
  customElements.define("login-formu", LoginForm);
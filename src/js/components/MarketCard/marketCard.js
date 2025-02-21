import output from '../../../css/output.css' with {type: 'css'}

/**
 * Login Form Web Component
 *
 * @class LoginForm
 * @emits 'market-card'
 */
export class MarketCard extends HTMLElement {
  
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
    <div id="market-card" class="bg-white shadow-md rounded-lg overflow-hidden flex items-center p-5 mx-4 mb-4 cursor-pointer border border-gray-200">
    <!-- Imagen del artículo -->
        <div class="w-36 h-36 flex-shrink-0 rounded-lg overflow-hidden border">
        <img src="" alt="lolol" class="w-full h-full object-cover">
        </div>

        <!-- Contenido de la tarjeta -->
        <article class="flex flex-col justify-between flex-1 ml-5">
            <!-- Información principal -->
            <div>
            <h3 class="text-xl font-bold text-gray-800 truncate">ARTICULO TARJETA</h3>
            <p class="text-sm text-gray-600">USUARIO - LOCATION</p>
            </div>

            <!-- Descripción -->
            <p class="text-gray-700 text-sm my-2 line-clamp-2">LOOLOLOLOLOLOL</p>

            <!-- Precio y botones -->
            <div class="flex justify-between items-center mt-3">
                <span class="text-lg font-bold text-amber-500">599€</span>
                <button data-id="1" class="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition delete-item">
                    Eliminar
                </button>
            </div>
        </article>
    </div>
    `

    shadow.appendChild(style);

    const card = shadow.getElementById("market-card"); 
    card.addEventListener("click", this.deleteMarketCard.bind());
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

    deleteMarketCard(e) {

        const card = e.target.closest('#market-card');
        card.remove()// Elimina la tarjeta del DOM

    }

        //this.dispatchEvent(onFormSubmitEvent);

  }
  
  customElements.define("market-card", MarketCard);
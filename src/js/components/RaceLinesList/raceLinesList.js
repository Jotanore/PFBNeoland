import output from '../../../css/output.css' with {type: 'css'}
import { importTemplate } from '../../lib/importTemplate.js';


const TEMPLATE = {
    id: 'raceLinesListTemplate',
    url: './js/components/RaceLinesList/RaceLinesList.html'
}
// Wait for template to load
await importTemplate(TEMPLATE.url);



export class RaceLinesList extends HTMLElement {
  static observedAttributes = ['racelines'];
  raceLineList = []

  get racelines(){
    return this.getAttribute('racelines');
  }

  set racelines(newValue){
    this.setAttribute('racelines', newValue);
  }

  get template(){
    return document.getElementById(TEMPLATE.id);
  }

    constructor() {
      // Always call super first in constructor
      super();
      this.racelines = []
    }
  
    connectedCallback() {
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets.push(output);
        
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`Attribute ${name} has changed.`, oldValue, newValue);

        if (name === 'racelines') {
            console.log(`attributeChangedCallback: Attribute ${name} has changed.`, oldValue, newValue);
            this._setUpContent();
          }
      }
  
    disconnectedCallback() {
      console.log("Custom element removed from page.");

      window.removeEventListener('stateChanged', this._handleStateChanged);
    }
  
  
    

    //private methods


    _setUpContent() {
        // Prevent render when disconnected or the template is not loaded
        if (this.shadowRoot && this.template && this.racelines) {
          const racelines = JSON.parse(this.racelines)
          // Replace previous content
          this.shadowRoot.innerHTML = '';
          this.shadowRoot.appendChild(this.template.content.cloneNode(true));
            console.log('Racelines',racelines)
          racelines.forEach((raceline) => {
            this._addNewLi(raceline)
          });
        }
      }
1
    _addNewLi(newRaceLine){
        console.log(newRaceLine)
        const lineList = this.shadowRoot.getElementById('racelines-container')
        const raceLineList = this.shadowRoot.getElementById('race-line-list')
        const html = `<li>Linea:${newRaceLine.circuitName} | Fecha: ${newRaceLine.date} <button class="bg-amber-400 hover:bg-amber-500 text-white font-bold py-2 px-6 rounded-full shadow-md show-line">
                            Ver
                        </button></li>`
        raceLineList.insertAdjacentHTML('afterbegin', html)

        console.log(lineList)
        const lastLine = lineList.querySelector('li');
        console.log(lastLine)
        const showBtn = lastLine.querySelector('.show-line');
        console.log(showBtn)
        showBtn.addEventListener('click', this._openRaceline.bind(this, newRaceLine))

  }

  _openRaceline(id){
    let newEvent = new CustomEvent(
      "open-raceline-event", {
        bubbles: true,
        detail: id
      })
      this.dispatchEvent(newEvent)
    }
  }
  
  customElements.define("race-lines-list", RaceLinesList);
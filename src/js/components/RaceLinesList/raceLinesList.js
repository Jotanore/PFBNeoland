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
        const raceLineList = this.shadowRoot.getElementById('race-line-list')
        const html = `<li>Linea:${newRaceLine.circuitName} Fecha: XDs</li>`
        raceLineList.insertAdjacentHTML('afterbegin', html)
    }

  }
  
  customElements.define("race-lines-list", RaceLinesList);
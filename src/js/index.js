// @ts-nocheck
'use strict'

document.addEventListener('DOMContentLoaded', async () => {

    const page = document.getElementsByTagName('body')

   switch (page[0].id){
        case 'index':
            console.log(`Estoy en ${page[0].id}`)
            break
        case 'circuits':
            console.log(`Estoy en ${page[0].id}`)
            await getCircuitData()
            assignCircuitListeners()
            createMap()
            break
        case 'events':
            console.log(`Estoy en ${page[0].id}`)
            break
        case 'market':
            console.log(`Estoy en ${page[0].id}`)
            break
        case 'forum':
            console.log(`Estoy en ${page[0].id}`)
            break
   }

   async function getCircuitData(){
        const API_CIRCUITS = 'api/get.circuits.json'
        const apiCircuit = await fetch(API_CIRCUITS)
        const circuitArray = await apiCircuit.json();

        circuitArray.forEach( function (/** @type {{name: string; distance: number}} */ a){

            showCircuitCard(a)
        })
   }

  
    
   function createMap(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(
            function (position){
                const {latitude} = position.coords;
                const {longitude} = position.coords;
    
                console.log(`https://www.google.es/maps/@${latitude},${longitude}`)
    
                const coords = [latitude,longitude]
    
                const map = L.map('map').setView(coords, 13);
    
                L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(map);
                            }
            )   
       }
   }
   /**
    * 
    * @param {MouseEvent & { target: HTMLInputElement}} e 
    */
   function showCircuitExtendedCard(e){
    /** @type HTMLElement | null */
            const extendedInfo = e.target.closest('article')?.children[1]
            console.log(extendedInfo)
            if (extendedInfo?.classList.contains('__hidden')){
                extendedInfo.classList.remove('__hidden')
            }else{
                extendedInfo?.classList.add('__hidden')
            }

   }

   function assignCircuitListeners(){
    /** @type {HTMLCollectionOf<Element>} */
    const circuitCard = document.getElementsByClassName('__circuit-header-card')
            for (/** @type {Element,HTMLElement} */ let i of circuitCard){
                i.addEventListener('click', showCircuitExtendedCard)
            }      
   }

   /**
    * 
    * @param {object} n 
    * @param {string} n.name
    * @param {number} n.distance
    */
   function showCircuitCard(n){
        const circuitFrame = document.getElementById('card-container')
        const html = `<article class="mb-5">
                    <div class="bg-purple-200 min-h-12 max-h-24 w-full flex items-center __circuit-header-card">
                        <span class="mr-4 pl-2">${n.name}</span>
                        <span class="mr-4 pl-2 ">${n.distance}Km</span>
                    </div>

                    <div class="bg-purple-100 flex flex-wrap h-48 p-5 pt-7 w-full __hidden">
                        <span class="mr-4 pl-2 w-[40%]">Nombre sitio:</span>
                        <span class="mr-4 pl-2 w-[40%]">Ubicación:</span>
                        <span class="mr-4 pl-2 w-[40%]">Mejor tiempo KartHub:</span>
                        <span class="mr-4 pl-2 w-[40%]">Alquiler:</span>
                        <span class="mr-4 pl-2 w-[40%]"><a href="#">Sitio Web</a></span>
                    </div>
                </article>`
        circuitFrame?.insertAdjacentHTML('beforeend', html)
   }

   


});
'use strict'

document.addEventListener('DOMContentLoaded', () => {

    const page = document.getElementsByTagName('body')
    console.log(page[0].id)

   switch (page[0].id){
        case 'index':
            console.log(`Estoy en ${page[0].id}`)
            break
        case 'circuits':
            console.log(`Estoy en ${page[0].id}`)
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
    
});
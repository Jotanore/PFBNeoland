# Parte Front-End del trabajo de Fin de Bootcamp de NEOLAND

[![Netlify Status](https://api.netlify.com/api/v1/badges/158c9018-60d0-4c57-b588-8fd1f14eab10/deploy-status)](https://app.netlify.com/sites/karthubsite/deploys)

## Descripción

La aplicación consiste en una serie de herramientas para el mundillo del karting. Tiene información acerca de los circuitos, un creador de eventos, un mercado simple para listar objetos, un creador de trazadas para poder pintar y visualizar tus trazadas en los circuitos, una tabla de tiempos de los usuarios y sistema de perfiles y mensajería. Se accede desde el index.html y por ahora no hay un sistema de permisos. Ésta es la parte Front del proyecto.

La aplicación se encuentra aqui: [Karthub](https://karthubsite.netlify.app/)

![captura de pantalla](./src/imgs/indexcaptura.png)

Disponemos de::

* Index, con la landing page y el sistema de logueo y creación de perfiles.
* Apartado de circuitos, con un mapa y la info de algunos de ellos.
* Listado y creador de eventos, una parte social de la web.
* Mercado, para poner a la venta diferentes artículos.
* Trazadas, para poder pintar en los mapas tus recorridos y luego poder guardarlos, ya sea en tu perfil o en tu PC.
* Tabla de tiempos, con los últimos tiempos de los usuarios, filtros para ordenar por récord y una minitabla para ver tus vueltas comparándolas con el delta del record.

El código está desarrollado en Js nativo, con dos versiones del login una en web components nativos y la otra usando Lit.

Conocimientos del curso aplicados en este repositorio:

* HTML
* CSS (Responsive)
* Tailwind
* JavaScript nativo
* Javascript nativo y Lit Element para la creación de Web Components
* Servidores node.js
  * Estático, CRUD y de api por JSON para simular una base de datos (en desuso)
  * Servidor Express.js, actualmente activo.
* Base de datos MongoDB alojada en MongoDB Atlas.
* Tipado con JSDoc
* Documentación con JSDoc
* GitHub como gestión de Repositorio
* Archivo api.mjs en la carpeta netlify/functions para poder desplegar el servidor en netlify, y netlify.toml en la raiz para su configuración
* En una etapa de la app, se usó REDUX para la gestión de datos local.

La parte Back-end de este proyecto se encuentra aqui: [PFBServerNeoland](https://github.com/Jotanore/PFBServerNeoland)
Aun no teniendo parte back en este repositorio, existen las funcionalidades del server Express.js y Mongo en la carpeta de netlify, dentro del archivo api.mjs

## Dependencias de la aplicación

* Node >= 20.0.0
* Express
* MongoDB
* JSDoc
* Typescript
* Tailwind CSS
* ESLint
* Lint-Staged
* StyleLint
* Netlify (sólo si se va a desplegar en netlify)

## Plugings de VS Code recomendados

* [commitlint](https://marketplace.visualstudio.com/items?itemName=joshbolduc.commitlint)
* [Conventional Commits](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits)
* [Error Lens](https://marketplace.visualstudio.com/items?itemName=usernamehw.errorlens)
* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
* [GitHub Pull Requests](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github)
* [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server)
* [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
* [Postman](https://marketplace.visualstudio.com/items?itemName=Postman.postman-for-vscode)
* [Stylelint](https://marketplace.visualstudio.com/items?itemName=stylelint.vscode-stylelint)

## Instalación y ejecución

```bash
npm install
```

Ejecutar en el terminal el servidor del backend. (Recuerdo que esta es solo la parte Front y no dispone de este comando)

```bash
npm run express-server
```

Acceso desde: [http://127.0.0.1:6431](http://localhost:6431)

La configuración de los puertos está definida en el archivo .env, no incluído en el repositorio de git.

En lo relativo al interfaz, para la parte pública se aplican estilos responsive en función del tamaño de la pantalla para su uso en distintos dispositivos, con elementos Grid y Flex para esta funcionalidad.

Cada función/componente se ha creado intentando cumplir con los estándares de SOLID.

Existe la validación de tipados por medio de JSDoc en los comentarios, y ESLint tanto en los Git Hooks como apoyo por medio del plugin de VS Code.

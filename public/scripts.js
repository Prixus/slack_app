const username = prompt('What is your username?');

const socket = io('http://localhost:9000',{
    query: {
        username
    }
});

let nsSocket = '';

socket.on('nsList', (nsData) => {
   let namespacesDiv = document.querySelector('.namespaces');
   namespacesDiv.innerHTML = '';
   nsData.forEach((ns) => {
       namespacesDiv.innerHTML += `<div classes="namespace" ns=${ns.endpoint} > <img src="${ns.img}" />`;
   });

   Array.from(document.getElementsByClassName('namespace')).forEach((elem) => {
       elem.addEventListener('click', (e) => {
          const nsEndpoint = elem.getAttribute('ns');

           /**
            * Joins to the clicked endpoint
            */
          joinNs(nsEndpoint);
       });
   });

   joinNs('/wiki');
});
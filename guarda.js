/* Impede que o cardápio seja aberto dentro de outro site (clickjacking / cópia em moldura). */
if(window.top!==window.self){try{window.top.location.href=window.self.location.href}catch(e){document.documentElement.style.display='none'}}

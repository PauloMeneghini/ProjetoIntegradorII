const cbTermo = document.getElementById("cbTermo");
const btnTermo = document.getElementById("btnTermo");
const linkTermo = document.getElementById("linkTermo");
const btnRecarga = document.querySelector(".btnRecarga");
const modalTermo = document.getElementById("containerModalTermo");

function chamaTermo(tipoBilhete, codigoBilhete) {

    const recargarBilhete = document.getElementById('recargarBilhete');
  
    recargarBilhete.innerHTML = `Valor da recarga = ${tipoBilhete} Código: ${codigoBilhete}`;
    btnTermo.setAttribute('onclick', `recargarBilhete('${tipoBilhete}', ${codigoBilhete})`);
  
    modalTermo.classList.add('mostrar');
    linkTermo.setAttribute("href", `/pagamento?tipo=${tipoBilhete}`);
  
};

modalTermo.addEventListener('click', (evento) => {
    if(evento.target.id == "containerModalTermo" || evento.target.className == "fechaModal") {
        modalTermo.classList.remove('mostrar');
        linkTermo.setAttribute("href", `#`);
    }
});

function verifyCheckBox(){
    if (cbTermo.checked == true){
        btnTermo.className = "active";
        linkTermo.className = "linkTermoActive";
    } else {
        btnTermo.className = "btnTermo";
        linkTermo.className = "linkTermo";
    }
}

const bilhetes = document.querySelectorAll('.bilhete');

/*for(i = 0; i < bilhetes.length; i++) {

    // const textoBilhete = bilhetes[i].textContent.split(" ");
    const textoBilhete = bilhetes[i].textContent;

    const index = textoBilhete.indexOf("Tipo:");

    const tipoBilhete = textoBilhete.slice(index, index + 7);

    console.log(tipoBilhete);

    if( tipoBilhete == "Tipo:  ") {
        console.log("Bilhete invalido");

        bilhetes[i].classList.add('desativado');

    } else {
        console.log("Bilhete valido");
    }

}*/

bilhetes.forEach((bilhete) => {

    const textoBilhete = bilhete.textContent;

    const index = textoBilhete.indexOf("Tipo:");

    const tipoBilhete = textoBilhete.slice(index, index + 7);

    console.log(tipoBilhete);

    if( tipoBilhete == "Tipo:  ") {
        console.log("Bilhete invalido");

        bilhete.classList.remove('ativado');
        bilhete.classList.add('desativado');

    } else {
        console.log("Bilhete valido");
    }
    
})

const bilhetesDesativados = document.querySelectorAll('.bilhete.desativado .btnsBilhete .btnUsarBilhete');

bilhetesDesativados.forEach((bilheteDesativado) => {
    console.log(bilheteDesativado);

    bilheteDesativado.classList.add('desativado');
})

const bilhetesAtivados = document.querySelectorAll('.bilhete.ativado .btnsBilhete .btnRecarregarBilhete');

bilhetesAtivados.forEach((bilheteAtivo) => {
    bilheteAtivo.classList.add('desativado');
})

console.log(bilhetesAtivados);
console.log(bilhetesAtivados.length);
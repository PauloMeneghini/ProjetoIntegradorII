const cbTermo = document.getElementById("cbTermo");
const btnTermo = document.getElementById("btnTermo");
const linkTermo = document.getElementById("linkTermo");
const btnRecarga = document.querySelector(".btnRecarga");
const modalTermo = document.getElementById("containerModalTermo");

function chamaTermo(tipoBilhete) {
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
const cbTermo = document.getElementById("cbTermo");
const btnTermo = document.getElementById("btnTermo");
const linkTermo = document.getElementById("linkTermo");

function verifyCheckBox(){
    if (cbTermo.checked == true){
        btnTermo.className = "active";
        linkTermo.className = "linkTermoActive";
    } else {
        btnTermo.className = "btnTermo";
        linkTermo.className = "linkTermo";
    }
}

const cbTermo = document.getElementById("cbTermo");
const btnTermo = document.getElementById("btnTermo");

function verifyCheckBox(){
    if (cbTermo.checked == true){
        btnTermo.className = "active";
    } else {
        btnTermo.className = "btnTermo";
    }
}

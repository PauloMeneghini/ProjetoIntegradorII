const cbTermo = document.getElementById('cbTermo')
const btnTermo = document.getElementById('btnTermo')
const linkTermo = document.getElementById('linkTermo')
const btnRecarga = document.querySelector('.btnRecarga')
const modalTermo = document.getElementById('containerModalTermo')
const descricaoTermo = document.getElementById('descricaoTermo')

function chamaTermo(tipoBilhete, codigoBilhete) {
  const recargarBilhete = document.getElementById('recargarBilhete')

  recargarBilhete.innerHTML = `Valor da recarga = ${tipoBilhete} Código: ${codigoBilhete}`
  btnTermo.setAttribute(
    'onclick',
    `recargarBilhete('${tipoBilhete}', ${codigoBilhete})`
  )

  switch (tipoBilhete) {
    case 'unico':
      descricaoTermo.innerHTML =
        'Bilhete único, que dará direito ao usuário utilizar o bilhete apenas uma vez. Deverá aparecer mensagem ao usuário explicando o modo de utilização, o valor a ser pago e a confirmação para o aceite da compra.'
      break

    case 'duplo':
      descricaoTermo.innerHTML =
        'Bilhete duplo, que dará direito ao usuário utilizar o bilhete duas vezes. Deverá aparecer mensagem ao usuário explicando o modo de utilização, o valor a ser pago e a confirmação para o aceite da compra.'
      break

    case '7 dias':
      descricaoTermo.innerHTML =
        'Bilhete de 7 dias, que dará ao usuário utilizar o transporte por um período de 7 dias. Deverá aparecer mensagem ao usuário explicando o modo de utilização, o valor a ser pago e a confirmação para o aceite da compra.'
      break

    case '30 dias':
      descricaoTermo.innerHTML =
        'Bilhete de 30 dias, que dará ao usuário utilizar o transporte por um período de Deverá aparecer mensagem ao usuário explicando o modo de utilização, o valor a ser pago e a confirmação para o aceite da compra.'
      break
  }

  modalTermo.classList.add('mostrar')
}

modalTermo.addEventListener('click', evento => {
  if (
    evento.target.id == 'containerModalTermo' ||
    evento.target.className == 'fechaModal'
  ) {
    modalTermo.classList.remove('mostrar')
    linkTermo.setAttribute('href', `#`)
    descricaoTermo.innerHTML = ''
  }
})

function verifyCheckBox() {
  if (cbTermo.checked == true) {
    btnTermo.className = 'active'
    linkTermo.className = 'linkTermoActive'
  } else {
    btnTermo.className = 'btnTermo'
    linkTermo.className = 'linkTermo'
  }
}

const bilhetes = document.querySelectorAll('.bilhete')

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

bilhetes.forEach(bilhete => {
  const textoBilhete = bilhete.textContent

  const index = textoBilhete.indexOf('Tipo:')

  const tipoBilhete = textoBilhete.slice(index, index + 7)

  console.log(tipoBilhete)

  if (tipoBilhete == 'Tipo:  ') {
    console.log('Bilhete invalido')

    bilhete.classList.remove('ativado')
    bilhete.classList.add('desativado')
  } else {
    console.log('Bilhete valido')
  }
})

const bilhetesDesativados = document.querySelectorAll(
  '.bilhete.desativado .btnsBilhete .btnUsarBilhete'
)

bilhetesDesativados.forEach(bilheteDesativado => {
  console.log(bilheteDesativado)

  bilheteDesativado.classList.add('desativado')
})

const bilhetesAtivados = document.querySelectorAll(
  '.bilhete.ativado .btnsBilhete .btnRecarregarBilhete'
)

bilhetesAtivados.forEach(bilheteAtivo => {
  bilheteAtivo.classList.add('desativado')
})

console.log(bilhetesAtivados)
console.log(bilhetesAtivados.length)

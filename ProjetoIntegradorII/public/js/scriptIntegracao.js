function gerarBilhete(bilhete) {
  let objBilhete = { codigo: undefined, tipo: bilhete, data_geracao: '' }
  let url = `http://localhost:4000/bilhete`

  let res = axios
    .post(url, objBilhete)
    .then(response => {
      if (response.data) {
        const modalMensagem = document.getElementById('containerModalMensagem')
        const H3ModalMensagem = document.getElementById('mensangem')

        console.log(modalMensagem)
        console.log(H3ModalMensagem)

        modalMensagem.addEventListener('click', evento => {
          if (
            evento.target.id == 'containerModalMensagem' ||
            evento.target.className == 'fechaModal'
          ) {
            modalMensagem.classList.remove('mostrar')
          }
        })

        H3ModalMensagem.innerHTML = response.data

        modalMensagem.classList.add('mostrar')

        console.log(response.data)

        setTimeout(() => {
          window.location.href = '/mostraBilhete'
        }, 3000)
      }
    })
    .catch(error => {
      if (error.response) {
        // const msg = new Comunicado(
        //   error.response.data.codigo,
        //   error.response.data.mensagem,
        //   error.response.data.descricao
        // )
        // alert(msg.get())
        // console.log(error)
      }
    })
}

function mostraDadosBilhete(codigo, tipo) {
  window.location.href = `/mostraBilhete?codigo=${codigo}&tipo=${tipo}`
}

function modalRelatorio() {
  const modalMensagem = document.getElementById('containerModalRelatorio')
  const conteudoRelatorio = document.getElementById('conteudoRelatorio')

  console.log(modalMensagem)
  console.log(conteudoRelatorio)

  modalMensagem.addEventListener('click', evento => {
    if (
      evento.target.id == 'containerModalRelatorio' ||
      evento.target.className == 'fechaModalRelatorio'
    ) {
      modalMensagem.classList.remove('mostrar')
    }
  })
  //conteudoRelatorio.innerHTML = 'teste'
  modalMensagem.classList.add('mostrar')
}

function Comunicado(codigo, tipo, mensagem, resposta) {
  this.codigo = codigo
  this.tipo = tipo
  this.mensagem = mensagem
  //this.resposta = resposta;

  this.get = function () {
    return (
      this.codigo +
      ' \n ' +
      this.tipo +
      ' \n ' +
      this.mensagem /* + " - " +
                this.resposta*/
    )
  }
}

function cadastrarUsuario() {
  const btnCadastrar = document.getElementById('btnCadastrar')
  const nomeUsuario = document.getElementById('nomeUsuario').value
  const emailCadastro = document.getElementById('emailCadastro').value
  const senhaCadastro = document.getElementById('senhaCadastro').value
  const celularCadastro = document.getElementById('celularCadastro').value
  const modalMensagem = document.getElementById('containerModalMensagem')
  const H3ModalMensagem = document.getElementById('mensangem')

  const validaEmail = /\S+@\S+\.\S+/ // usado para validar o email

  modalMensagem.addEventListener('click', evento => {
    if (
      evento.target.id == 'containerModalMensagem' ||
      evento.target.className == 'fechaModal'
    ) {
      modalMensagem.classList.remove('mostrar')
    }
  })

  if (!nomeUsuario) {
    H3ModalMensagem.innerHTML = 'Nome é obrigatório!'
    modalMensagem.classList.add('mostrar')
  } else if (!emailCadastro) {
    H3ModalMensagem.innerHTML = 'Email é obrigatório!'
    modalMensagem.classList.add('mostrar')
  } else if (!validaEmail.test(emailCadastro)) {
    H3ModalMensagem.innerHTML = 'Digite um e-mail valido'
    modalMensagem.classList.add('mostrar')
  } else if (!senhaCadastro) {
    H3ModalMensagem.innerHTML = 'Senha é obrigatório!'
    modalMensagem.classList.add('mostrar')
  } else if (!celularCadastro) {
    H3ModalMensagem.innerHTML = 'Celular é obrigatório!'
    modalMensagem.classList.add('mostrar')
    console.log(celularCadastro)
  } else {
    let objUsuario = {
      nomeUsuario: nomeUsuario,
      emailCadastro: emailCadastro,
      senhaCadastro: senhaCadastro,
      celularCadastro: celularCadastro
    }
    let url = 'http://localhost:4000/cadUser'

    axios
      .post(url, objUsuario)
      .then(response => {
        if (response.data == 'EMAIL JÁ CADASTRADO!') {
          modalMensagem.classList.add('mostrar')
          H3ModalMensagem.innerHTML = response.data
        } else {
          modalMensagem.classList.add('mostrar')
          H3ModalMensagem.innerHTML =
            'Usuário cadastrado com sucesso <br> Você será redirecionado ao tela de login'
          setTimeout(() => {
            window.location.href = '/login'
          }, 3000)
        }
      })
      .catch(erro => {
        alert(erro)
      })
  }
}

function mascaraCelular(celular) {
  if (celular.value.length == 0) {
    celular.value = '(' + celular.value
  }

  if (celular.value.length == 3) {
    celular.value = celular.value + ')'
  }

  if (celular.value.length == 9) {
    celular.value = celular.value + '-'
  }
}

function usarBilhete(bilhete) {
  const arrayBilhete = bilhete.split('&')
  let objBilhete = { codigo: arrayBilhete[0], tipo: arrayBilhete[1] }

  //setTimeout(validaTempo(), 3000)

  // function validaTempo() {
  //   console.log('entrei')
  //   const dataAtual = new Date().toLocaleString()

  //   if (objBilhete.tipo != '') {
  // //     let url = 'http://localhost:4000/obtemData'
  //     axios
  //       .post(url, objBilhete)
  //       .then(response => {
  //         if (response.data) {
  //           const dataExpiracao = response.data

  //           console.log('Data expiração: ', dataExpiracao)
  //           console.log('Data atual: ', dataAtual)

  //           Date.parse(dataAtual)
  //           Date.parse(dataExpiracao)

  //           const horarioAtual = dataAtual.split(' ')
  //           const horarioExpiracao = dataExpiracao.split(' ')

  //           console.log('completo = ', horarioAtual, horarioExpiracao)

  //           if (horarioAtual[0] >= horarioExpiracao[0] && horarioAtual[1] > horarioExpiracao[1])
  //             console.log('Bilhete expirado!')
  //           else
  //             console.log('Cai no else')
  //         }
  //       })
  //       .catch(erro => {
  //         alert(erro)
  //       })

  //     console.log(dataAtual)
  //   } else {
  //     console.log('ERRO = ', objBilhete.tipo)
  //   }
  // }

  let url = 'http://localhost:4000/utilizaBilhete'

  axios
    .post(url, objBilhete)
    .then(response => {
      if (response.data) {
        const modalMensagem = document.getElementById('containerModalMensagem')
        const H3ModalMensagem = document.getElementById('mensangem')
        const QRcode = document.getElementById('QRCode')
        const codigoBilhete = document.getElementById('codigoBilheteU')

        console.log(modalMensagem)
        console.log(H3ModalMensagem)

        modalMensagem.addEventListener('click', evento => {
          if (
            evento.target.id == 'containerModalMensagem' ||
            evento.target.className == 'fechaModal' ||
            evento.target.className == 'btnCancelar'
          ) {
            modalMensagem.classList.remove('mostrar')
          }
        })

        QRcode.src = `https://chart.googleapis.com/chart?cht=qr&chs=300x300&chl=${response.data[1]}`
        codigoBilhete.innerHTML = `Bilhete Nº: ${response.data[1]}`
        H3ModalMensagem.innerHTML = `Tempo restante: ${response.data[0]}`

        modalMensagem.classList.add('mostrar')

        console.log(response.data)
      }
    })
    .catch(erro => {
      alert(erro)
    })
}

function mascaraCelular(celular) {
  if (celular.value.length == 0) {
    celular.value = '(' + celular.value
  }

  if (celular.value.length == 3) {
    celular.value = celular.value + ')'
  }

  if (celular.value.length == 9) {
    celular.value = celular.value + '-'
  }
}

function chamaRecargaBilhete(bilhete) {
  const modalRecarga = document.getElementById('containerModalRecarga')
  const exibeNumBilhete = document.getElementById('numBilhete')
  const btnsRecarga = document.querySelectorAll('.btnRecarga')

  btnsRecarga.forEach(btnRecarga => {
    btnRecarga.setAttribute(
      'onclick',
      `chamaTermo('${btnRecarga.value}', ${bilhete})`
    )
  })

  exibeNumBilhete.innerHTML = `ESCOLHA A RECARGA DO SEU BILHETE Nº: ${bilhete}`

  modalRecarga.addEventListener('click', evento => {
    if (
      evento.target.id == 'containerModalRecarga' ||
      evento.target.className == 'fechaModal' ||
      evento.target.className == 'btnCancelar'
    ) {
      modalRecarga.classList.remove('mostrar')
    }
  })

  modalRecarga.classList.add('mostrar')
}

function recargarBilhete(recarga, codigoBilhete) {
  let objBilhete = { recarga: recarga, codigoBilhete: codigoBilhete }

  let url = 'http://localhost:4000/recarga'

  axios
    .post(url, objBilhete)
    .then(response => {
      if (response.data) {
        const modalMensagem = document.getElementById('containerModalMensagem')
        const H3ModalMensagem = document.getElementById('mensangem')

        modalMensagem.addEventListener('click', evento => {
          if (
            evento.target.id == 'containerModalMensagem' ||
            evento.target.className == 'fechaModal' ||
            evento.target.className == 'btnCancelar'
          ) {
            modalMensagem.classList.remove('mostrar')
          }
        })

        H3ModalMensagem.innerHTML = response.data

        modalMensagem.classList.add('mostrar')

        setTimeout(() => {
          window.location.href = '/mostraBilhete'
        }, 3000)
      }
    })
    .catch(erro => {
      alert(erro)
    })
}

function chamaGeraBilhete(bilhete) {
  const modalTermo = document.getElementById('containerModalTermo')
  const btnTermo = document.getElementById('btnTermo')

  console.log(bilhete)

  modalTermo.addEventListener('click', evento => {
    if (
      evento.target.id == 'containerModalRecarga' ||
      evento.target.className == 'fechaModal' ||
      evento.target.className == 'btnCancelar'
    ) {
      modalTermo.classList.remove('mostrar')
    }
  })

  btnTermo.setAttribute('value', bilhete)

  modalTermo.classList.add('mostrar')
}

//Definicoes de variaveis para toda a pagina (ou site)
//Variaveis essas relacionadas a operações com Metamask e Contratos Inteligentes no Ethereum
var contaAtual;
var provedorDeSignatarios;
var signatario;
var contratoComSignatario;

/*
FUNCOES RELACIONADAS A OPERACOES COM METAMASK E CONTRATOS INTELIGENTES NO ETHEREUM
*/
function conectaAoMetamask() {
  event.preventDefault();
  console.log("conectaAoMetamask chamado");
  if (typeof window.ethereum === "undefined") {
    alert("Por favor instale o MetaMask em metamask.io");
    return;
  } else {
    requisitaAcessoAContas();
  }
}

function requisitaAcessoAContas() {
  ethereum
    .send("eth_requestAccounts")
    .then(gerenciaTrocaDeSelecaoDeContas)
    .catch((err) => {
      if (err.code === 4001) {
        // EIP 1193 userRejectedRequest error
        console.log("Por favor, dê permissão a este site no seu Metamask.");
      } else {
        console.error(err);
      }
    });
  ethereum.on("accountsChanged", gerenciaTrocaDeSelecaoDeContas);
}

function gerenciaTrocaDeSelecaoDeContas(_contas) {
  if (typeof provedorDeSignatarios === "undefined") {
    provedorDeSignatarios = new ethers.providers.Web3Provider(web3.currentProvider);
  }
  var contas;
  if (typeof _contas.result === "undefined") {
    contas = _contas;
  } else {
    contas = _contas.result;
  }
  console.log("gerenciaTrocaDeSelecaoDeEndereco - parametro recebido", contas);
  if (contas.length === 0) {
    alert("Por favor instale o MetaMask em metamask.io ou o autorize a acessar a sua conta");
    return;
  }
  if (contas[0] !== contaAtual) {
    contaAtual = contas[0];
    if (contaAtual) {
      $("#btnSalvarRegRequerente").prop("disabled", false);
      $("#btnSalvarRetRequerente").prop("disabled", false);
      $("#btnSalvarRegRequerida").prop("disabled", false);
      $("#btnSalvarRetRequerida").prop("disabled", false);
      $("#btnSalvarRegCoArb").prop("disabled", false);
      $("#btnSalvarRegArbPresi").prop("disabled", false);
      $("#btnSalvarRetCoArb").prop("disabled", false);
      $("#btnSalvarRetArbPresi").prop("disabled", false);
      $("#btnSalvarAssinaCoArb").prop("disabled", false);
      $("#btnSalvarAssinaArbPresi").prop("disabled", false);
      $("#btnSalvarHonorario").prop("disabled", false);
      $("#btnSalvarCustasAudiencia").prop("disabled", false);
      $("#btnVerificar").prop("disabled", false);
      $("#btnPagarRequerimento").prop("disabled", false);
      $("#btnPagarMesRequerente").prop("disabled", false);
      $("#btnPagarMesRequerida").prop("disabled", false);
      $("#btnPagarHonorariosRequerente").prop("disabled", false);
      $("#btnPagarHonorariosRequerida").prop("disabled", false);
      $("#btnPagarAudienciaRequerente").prop("disabled", false);
      $("#btnPagarAudienciaRequerida").prop("disabled", false);
      buscarDadosDoContratoInteligente(contratoComSignatario);
    }
  }
  signatario = provedorDeSignatarios.getSigner();
  contratoComSignatario = new ethers.Contract(enderecoContrato, abiContrato, signatario);
}

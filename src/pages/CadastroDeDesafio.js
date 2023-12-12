import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';

function CadastroDeDesafio() {
  // Estado que controla se o modal está aberto ou fechado
  const [abrirPaginaDoDesafio, setAbrirPaginaDeDesafio] = useState(false);

  // Estado que mantém os dados do formulário de desafios
  const [dadosFormulario, setDadosFormulario] = useState({
    nomeDoDesafio: '',
    periodos: '',
    professor: '',
    dataInicio: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
    dataFim: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`,
    diaDaSemana: '',
    horario: '',
    sala: ''
  });

  // Estado que mantém uma lista de desafios cadastrados
  const [listaDeDesafios, setListaDeDesafios] = useState([]);

  // Estado que mantém o desafio que está sendo editado
  const [desafioSelecionado, setDesafioSelecionado] = useState(null);

  // Efeito que carrega os dados do localStorage quando o componente é montado
  useEffect(() => {
    const dadosLocalStorage = JSON.parse(localStorage.getItem('desafio')) || [];
    setListaDeDesafios(dadosLocalStorage);
  }, []);

  // Função para fechar o modal e limpar o desafio selecionado
  const handleClose = () => {
    setAbrirPaginaDeDesafio(false);
    setDesafioSelecionado(null);
  };

  // Função para abrir o modal
  const handleShow = () => setAbrirPaginaDeDesafio(true);

  // Função para lidar com a mudança nos campos do formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDadosFormulario({ ...dadosFormulario, [name]: value });
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário, que é recarregar a página

    if (desafioSelecionado === null) {
      // Adicionar novo desafio
      if (localStorage.getItem('desafio') != null) {
        let valorFinal = JSON.parse(localStorage.getItem('desafio'))
        valorFinal.push(dadosFormulario)
        localStorage.setItem('desafio', JSON.stringify(valorFinal))
      } else {
        localStorage.setItem('desafio', JSON.stringify([dadosFormulario]))
      }
    } else {
      // Atualizar desafio existente
      const desafiosAtualizados = listaDeDesafios.map((desafio, index) => (
        index === desafioSelecionado ? dadosFormulario : desafio
      ));
      localStorage.setItem('desafio', JSON.stringify(desafiosAtualizados));
    }

    // Atualizar a lista de desafios
    setListaDeDesafios(JSON.parse(localStorage.getItem('desafio')));

    // Atualizar as associações nos professores e períodos
    let listaDeProfessor = JSON.parse(localStorage.getItem('professor'))
    listaDeProfessor
      .filter(professor => professor.nomeDoProfessor === dadosFormulario.professor)
      .forEach(professor => professor.desafioAssociado = dadosFormulario.nomeDoDesafio)
    localStorage.setItem("professor", JSON.stringify(listaDeProfessor))

    let listaDePeriodos = JSON.parse(localStorage.getItem('periodos'))
    listaDePeriodos
      .filter(periodos => periodos.numeroDoPeriodo === dadosFormulario.periodos)
      .forEach(periodos => periodos.desafioAssociado.push(dadosFormulario))
    localStorage.setItem("periodos", JSON.stringify(listaDePeriodos))

    // Limpar os campos do formulário e o desafio selecionado
    setDadosFormulario({
      nomeDoDesafio: '',
      periodos: '',
      professor: '',
      dataInicio: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      dataFim: `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate() + 1}`,
      diaDaSemana: '',
      horario: '',
      sala: ''
    });
    setDesafioSelecionado(null);
  }

  // Função para editar um desafio
  const handleEditarDesafio = (index) => {
    setDesafioSelecionado(index);
    setAbrirPaginaDeDesafio(true);
    setDadosFormulario(listaDeDesafios[index]);
  }

  // Função para excluir um desafio
  const handleExcluirDesafio = (index) => {
    const desafiosAtualizados = listaDeDesafios.filter((desafio, i) => i !== index);
    localStorage.setItem('desafio', JSON.stringify(desafiosAtualizados));
    setListaDeDesafios(desafiosAtualizados);
  }

  // Renderiza um botão que, ao ser clicado, abre um modal com o formulário para cadastrar o desafio
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Cadastro de Desafio
      </Button>

      {/* Modal para o cadastro de desafios */}
      <Modal show={abrirPaginaDoDesafio} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Desafio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Formulário dentro do modal */}
          <Form onSubmit={handleSubmit} className="cadastroDeDesafio">
            {/* Campo para o nome do desafio */}
            <Form.Group controlId="nomeDoDesafio">
              <Form.Label>Nome do Desafio</Form.Label>
              <Form.Control onChange={handleInputChange} name="nomeDoDesafio" value={dadosFormulario.nomeDoDesafio} type="text" />
            </Form.Group>
            {/* Campo para os períodos */}
            <Form.Group controlId="periodos">
              <Form.Label>Períodos</Form.Label>
              <Form.Select onChange={handleInputChange} name="periodos">
                <option>Selecione um dos Períodos disponíveis</option>
                {localStorage.getItem("periodos") != null &&
                  JSON.parse(localStorage.getItem("periodos"))
                    .map((periodos) => (
                      <option key={periodos.numeroDoPeriodo} value={periodos.numeroDoPeriodo}>{periodos.numeroDoPeriodo}</option>
                    ))}
              </Form.Select>
            </Form.Group>
            {/* Campo para os professores */}
            <Form.Group controlId="professor">
              <Form.Label>Professor</Form.Label>
              <Form.Select onChange={handleInputChange} name="professor">
                <option>Selecione um dos Professores disponíveis</option>
                {localStorage.getItem("professor") != null &&
                  JSON.parse(localStorage.getItem("professor"))
                    .filter((professor) => professor.desafioAssociado === null)
                    .map((professor) => (
                      <option key={professor.nomeDoProfessor} value={professor.nomeDoProfessor}>{professor.nomeDoProfessor}</option>
                    ))}
              </Form.Select>
            </Form.Group>
            {/* Campo para a data de início */}
            <Form.Group controlId="dataInicio">
              <Form.Label>Data Início</Form.Label>
              <Form.Control onChange={handleInputChange} name="dataInicio" value={dadosFormulario.dataInicio} type="date" />
            </Form.Group>
            {/* Campo para a data de fim */}
            <Form.Group controlId="dataFim">
              <Form.Label>Data Fim</Form.Label>
              <Form.Control onChange={handleInputChange} name="dataFim" value={dadosFormulario.dataFim} type="date" />
            </Form.Group>
            {/* Campo para o dia da semana */}
            <Form.Group controlId="diaDaSemana">
              <Form.Label>Dia da semana</Form.Label>
              <Form.Select onChange={handleInputChange} name="diaDaSemana">
                <option>Selecione um dia da semana</option>
                <option value="segunda">Segunda-feira</option>
                <option value="terca">Terça-feira</option>
                <option value="quarta">Quarta-feira</option>
                <option value="quinta">Quinta-feira</option>
                <option value="sexta">Sexta-feira</option>
              </Form.Select>
            </Form.Group>
            {/* Campo para o horário */}
            <Form.Group controlId="horario">
              <Form.Label>Horário</Form.Label>
              <Form.Control onChange={handleInputChange} name="horario" value={dadosFormulario.horario} type="text" />
            </Form.Group>
            {/* Campo para as salas */}
            <Form.Group controlId="sala">
              <Form.Label>Salas</Form.Label>
              <Form.Select onChange={handleInputChange} name="sala">
                <option>Selecione uma sala</option>
                {localStorage.getItem("salas") != null &&
                    JSON.parse(localStorage.getItem("salas")).map(
                      salas => (
                        <option value={salas.numero}>Número: {salas.numero} Andar: {salas.andar}</option>
                      )
                      
                    )
                }
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">enviar</Button>
          </Form>
          {/* Exibir dinamicamente os desafios salvos */}

        </Modal.Body>
      </Modal>

      <div style={{ marginTop: '70px', marginBottom: '70px' }}>
  {/* "Desafios Salvos" e lista de desafios aqui */}
</div>

      <div>
        <h1>Desafios Salvos</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nome do Desafio</th>
              <th>Períodos</th>
              <th>Professor</th>       
              <th>Sala</th>       
              <th>Data início</th>
              <th>Data fim</th>
              <th>Dia da semana</th>
              <th>Horário</th>
              <th>Ações</th>
              <th></th>
              {/* Adicione outras colunas conforme necessário */}
            </tr>
          </thead>
          <tbody>
            {listaDeDesafios.map((desafio, index) => (
              <tr key={index}>
                <td>{desafio.nomeDoDesafio}</td>
                <td>{desafio.periodos}</td>
                <td>{desafio.professor}</td>
                <td>{desafio.sala}</td>
                <td>{desafio.dataInicio}</td>
                <td>{desafio.dataFim}</td>
                <td>{desafio.diaDaSemana}</td>
                <td>{desafio.horario}</td>
                <td>
                  <Button variant="info" onClick={() => handleEditarDesafio(index)}>Editar</Button>
                  <Button variant="danger" onClick={() => handleExcluirDesafio(index)}>Excluir</Button>
                </td>
                {/* Adicione outras colunas conforme necessário */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default CadastroDeDesafio;
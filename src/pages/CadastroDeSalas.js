import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.css';
import React, {useState} from 'react';

function CadastroDeSalas() {
  const [abrirPaginaDaSalas, setAbrirPaginaDaSalas] = useState(false);
  const [dadosFormulario, setDadosFormulario] = useState({
    numero: '',
    andar: '',
    predio: '',
    numeroDeCadeiras: ''
  });
  const handleClose = () => setAbrirPaginaDaSalas(false);
  const handleShow = () => setAbrirPaginaDaSalas(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDadosFormulario({ ...dadosFormulario, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (localStorage.getItem('salas') != null) {
      let valorFinal = JSON.parse(localStorage.getItem('salas'))
      valorFinal.push(dadosFormulario)
      localStorage.setItem('salas', JSON.stringify(valorFinal))
    } else {
      localStorage.setItem("salas", JSON.stringify([dadosFormulario]))
    }
    setDadosFormulario({
      numero: '',
      andar: '',
      predio: '',
      numeroDeCadeiras: ''
    });
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Cadastro de salas
      </Button>
      
      <Modal show={abrirPaginaDaSalas} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Salas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit} className="CadastroDeSalas"> 
          <Form.Group controlId="numero">
              <Form.Label>Número</Form.Label>
              <Form.Control onChange={handleInputChange} name="numero" value={dadosFormulario.numero} type= "number"/>
            </Form.Group>
            <Form.Group controlId="andar">
              <Form.Label>Andar</Form.Label>
              <Form.Control onChange={handleInputChange} name="andar" value={dadosFormulario.andar} type="number"/>
            </Form.Group>  
            <Form.Group controlId= "predio">
              <Form.Label>Prédio</Form.Label>
              <Form.Control onChange={handleInputChange} name="predio" value={dadosFormulario.predio} type="number"/>
            </Form.Group>
            <Form.Group controlId= "numeroDeCadeiras">
              <Form.Label>Número de cadeiras</Form.Label>
              <Form.Control onChange={handleInputChange} name="numeroDeCadeiras" value={dadosFormulario.numeroDeCadeiras} type="number"/>
            </Form.Group>
            <Button variant="primary" type="submit" >enviar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CadastroDeSalas;
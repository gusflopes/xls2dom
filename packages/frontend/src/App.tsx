import React, { useState} from 'react';
import {Container, Col, Row, FormGroup, FormControl, FormLabel, FormText, Button, FormFile} from 'react-bootstrap';

function App() {
  const [file, setFiel] = useState();
  return (
    <Container className="App">
      <Row className="App-header">
        <h1>Gerando arquivo de importação de lançamentos contábeis do Domínio Sistemas.</h1>
      </Row>

      <form>
        <FormGroup controlId="fortmCNPJ">
        
        </FormGroup>
        
        <FormFile />
        <Button>Enviar</Button>
      </form>
    </Container>
  );
}

export default App;

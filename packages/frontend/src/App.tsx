import React, { useState } from 'react';
import {Container, Col, Row, FormGroup, FormControl, FormLabel, FormText, Button, Navbar} from 'react-bootstrap';
import { xls2dom } from './lib/pastedExcelParser';
import { generateOutput } from './lib/generateOutput'
import {importExcel} from './lib/handleFile';
// import Dropzone from 'react-dropzone';
import MyDropZone from './components/DropZone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import styled from 'styled-components';

function App() {
  
  const [file, setFile] = useState<File>();
  const [lancamentos, setLancamentos] = useState<string>();
  const [cnpj, setCnpj] = useState<string>();
  const [user, setUser] = useState('');
  const [imported, setImported] = useState<any[]>();

  async function handleFile(inputFile: any) {
    if (file !== undefined) return toast.error('Arquivo já importado. Para substituir recarregue a página.');
    // if (file === undefined) console.log('não tem file');

    const newFile = inputFile[0]
    if (newFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return toast.error('Formato não suportado. Utilize a planilha exemplo ou o formulário.');
    }
    setFile(newFile);
    const response: Lancamentos[] = await importExcel(newFile);
    // console.log('final', response);
    return setImported(response)
  }

  async function handleSubmit() {
    // testing(cnpj, user, lancamentos)
    if (!lancamentos && !file) return toast.error('Você deve importar um arquivo ou preencher o campo Lançamentos Contábeis.')
    if (lancamentos) {
      try {
        const response: Lancamentos[] = await xls2dom(lancamentos);
        const {id, data, valor, debito, credito, historico} = response[0]
        if (!id || !data || !valor || !debito || !credito || !historico) throw new Error('testando!')
        return setImported(response);
      } catch (err) {
        toast.error('Erro na importação: Você deve colar a planilha no formulário ou importar o arquivo.')
        // console.log(err);
      }
    }
    if (file) {
      return toast.error('Arquivo xlsx já importado. Clique em exportar.')
    }
  }

  async function handleExport() {
    // if (!file) console.log('Não foram importados arquivos...')
    if (!imported) return toast.error('Você deve importar os dados primeiro!')

      if (!cnpj || !user) return toast.error('Campos Usuário e CNPJ são obrigatórios')
      // if (imported && cnpj && user) {

        const outputContent = await generateOutput(imported, cnpj, user);
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=iso-8859-1,' + encodeURIComponent(outputContent));
        element.setAttribute('download', 'output.txt');
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
        
        return toast.success('Deu certo?');
      // }
  }

  return (
    <Container id="home" className="App">
      <ToastContainer autoClose={3000} />
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" width="30" height="30" className="d-inline-block-allign-top" alt="React logo"  />
          {' '}
          CTools: Lançamentos Contábeis
        </Navbar.Brand>
      </Navbar>
      <Row style={{marginTop: '15px'}}>
        <Col lg={6} md={6} sm={12} xs={12} >
          <FormGroup controlId="formCnpj">
            <FormLabel>CNPJ</FormLabel>
            <FormControl type="text" placeholder="Digite CNPJ da empresa" value={cnpj} onChange={(e: React.FormEvent<HTMLInputElement>) => setCnpj(e.currentTarget.value)} />
            <FormText>Digite apenas números.</FormText>
          </FormGroup>
          <FormGroup controlId="usuario">
            <FormLabel>Usuário</FormLabel>
            <FormControl type="text" placeholder="Digite o Usuário Domínio Sistemas" value={user} onChange={(e: React.FormEvent<HTMLInputElement>) => setUser(e.currentTarget.value)}  />
            <FormText>Nome do Usuário que constará no arquivo de importação.</FormText>
          </FormGroup>
          <FormGroup controlId="lancamentos">
            <FormLabel>Lançamentos Contábeis</FormLabel>
            <FormControl
              as="textarea"
              rows="4"
              value={lancamentos}
              onChange={(e: React.FormEvent<HTMLInputElement>) => setLancamentos(e.currentTarget.value)}
              placeholder="Anexe uma planilha do Excel ou cole aqui sua tabela de lançamentos contábeis"
            />
          </FormGroup>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12} >
          <MyDropZone file={file} handleFile={handleFile} />
        </Col>
      </Row>
      <Row style={{marginTop: '15px', justifyContent: 'center'}} >
        <Col xs={12} sm={12} md={6} lg={6} style={{display: 'flex', justifyContent: 'center'}}>
          <Button
            variant={!file ? "outline-primary": "outline-secondary"}
            disabled={file ? true : false}
            size="lg"
            style={ file ? {margin: '0 30px', cursor: 'not-allowed' } : {margin: '0 30px'}}
            onClick={handleSubmit}
          >Carregar</Button>
          <Button variant="success" size="lg" style={{margin: '0 30px'}} onClick={handleExport}>Exportar</Button>
        </Col>
        <Col xs={12} sm={12} md={6} lg={6}>
          <a href="/example.xlsx"><span style={{display: 'block', textAlign: 'center', alignSelf: 'center'}}>Download Planilha Modelo</span></a>
        </Col>
      </Row>
      <Row style={{ marginTop: '30px' }} >
        <Col lg={12}>
        {imported && (
        <table className="table table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Débito</th>
              <th scope="col">Crédito</th>
              <th scope="col">Valor</th>
              <th scope="col">Histórico</th>
            </tr>
          </thead>
          <tbody>
            {imported.map((i: Lancamentos) => (<tr key={`lcto-${i?.id}`}>
              <th scope="row">{i?.data}</th>
              <td>{i?.debito}</td>
              <td>{i?.credito}</td>
              <td>{i?.valor}</td>
              <td>{i?.historico}</td>
            </tr>))}
          </tbody>
        </table>)}
        </Col>
      </Row>
      <Row>
        <footer style={{marginLeft: 'auto', marginRight: 'auto'}} >
          <span>Desenvolvido por <a href="https://github.com/gusflopes" target="_blank" rel="noreferrer noopener"><strong>Gustavo Lopes</strong></a> e <a href="http://www.lscont.com.br" target="_blank" rel="noreferrer noopener"><strong>LSCONT</strong></a>. Todos os direitos reservados.</span>
        </footer>
      </Row>
    </Container>
  );
}

export default App;

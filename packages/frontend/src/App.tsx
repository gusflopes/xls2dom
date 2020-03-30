import React, { useState, useEffect } from 'react';
import {Container, Col, Row, FormGroup, FormControl, FormLabel, FormText, Button, FormFile} from 'react-bootstrap';
import { handleXlsFile, xls2dom, generateOutput } from './lamba';
import Dropzone from 'react-dropzone';
// import { toast } from 'toastify';
import { exampleData } from './_example';

interface Lancamentos {
  id?: string,
  data: string,
  debito: string,
  credito: string,
  valor: string,
  historico: string,
}

function App() {
  
  const [file, setFile] = useState();
  const [lancamentos, setLancamentos] = useState<string>();
  const [cnpj, setCnpj] = useState<string>();
  const [user, setUser] = useState('');
  const [imported, setImported] = useState<any[]>();

  async function handleFile(file: any) {
    console.log(file[0])
    const newFile = file[0]
    if (newFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return alert('Formato não suportado. Tente copiar os dados para a planilha exemplo.');
    }
    setFile(newFile);
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.onloadend = async () => {
      const binaryStr = reader.result;
      // console.log(binaryStr);
      const response = await handleXlsFile(binaryStr);
      console.log('working', response);
    }
    reader.readAsBinaryString(newFile);
  }

  async function handleSubmit() {
    // testing(cnpj, user, lancamentos)
    if (!lancamentos && !file) return alert('Você deve importar um arquivo ou preencher o campo Lançamentos Contábeis.')
    if (lancamentos) {
      const response: Lancamentos[] = await xls2dom(lancamentos);
      return setImported(response);
    }
    if (file) {
      return alert('Importação de XLS desabilitada. Copie o conteúdo da planilha para o campo Lançamentos Contábeis.')
    }
  }

  async function handleExport() {
    if (!file) console.log('Não foram importados arquivos...')
    if (!imported) return alert('Você deve importar os dados primeiro!')

      if (!cnpj || !user) return alert('Campos Usuário e CNPJ são obrigatórios')
      // if (imported && cnpj && user) {

        const outputContent = await generateOutput(imported, cnpj, user);
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=latin1,' + encodeURIComponent(outputContent));
        element.setAttribute('download', 'output.txt');
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
        
        return alert('Deu certo?');
      // }
  }

  useEffect(() => {
    console.log('Agora tem importado')
    console.log(imported);
  }, [imported]);

  return (
    <Container className="App">
      <Row className="App-header">
        <h1>Gerando arquivo de importação de lançamentos contábeis do Domínio Sistemas.</h1>
      </Row>

      <form>
        <Row>
          <Col>
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
            <FormGroup>
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
          <Col>
            <a href="/example.xls"><span>Download Planilha Modelo</span></a>
            <FormFile id="file-upload" label="Enviar seu arquivo"  onChange={handleFile} />
            <Dropzone onDrop={acceptedFiles => handleFile(acceptedFiles)}>
              {({getRootProps, getInputProps}) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                </section>
              )}
            </Dropzone>
          </Col>
        </Row>
          <Col lg={6} style={{display: 'flex', justifyContent: 'space-between'}}>
          <Button onClick={handleSubmit}>Importar</Button>
          <Button onClick={() => console.log(file)}>File</Button>
          <Button onClick={handleExport}>Exportar</Button>
          </Col>
          <Col />
      </form>
      <Row>
        {imported && (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Débito</th>
              <th>Crédito</th>
              <th>Valor</th>
              <th>Histórico</th>
            </tr>
          </thead>
          <tbody>
            {imported.map((i: Lancamentos) => (<tr key={i?.id}>
              <td>{i?.data}</td>
              <td>{i?.debito}</td>
              <td>{i?.credito}</td>
              <td>{i?.valor}</td>
              <td>{i?.historico}</td>
            </tr>))}
          </tbody>
        </table>)}
      </Row>
    </Container>
  );
}

export default App;

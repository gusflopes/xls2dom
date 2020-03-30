import React, { useState, useEffect } from 'react';
import {Container, Col, Row, FormGroup, FormControl, FormLabel, FormText, Button, FormFile} from 'react-bootstrap';
import { xls2dom } from './lib/pastedExcelParser';
import { generateOutput } from './lib/generateOutput'
import {importExcel} from './lib/handleFile';
import Dropzone from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  
  const [file, setFile] = useState();
  const [lancamentos, setLancamentos] = useState<string>();
  const [cnpj, setCnpj] = useState<string>();
  const [user, setUser] = useState('');
  const [imported, setImported] = useState<any[]>();

  async function handleFile(file: any) {
    const newFile = file[0]
    if (newFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return toast.error('Formato não suportado. Utilize a planilha exemplo ou o formulário.');
    }
    setFile(newFile);
    const response: Lancamentos[] = await importExcel(newFile);
    console.log('final', response);
    return setImported(response)
  }

  async function handleSubmit() {
    // testing(cnpj, user, lancamentos)
    if (!lancamentos && !file) return toast.error('Você deve importar um arquivo ou preencher o campo Lançamentos Contábeis.')
    if (lancamentos) {
      try {
        const response: Lancamentos[] = await xls2dom(lancamentos);
        const {id, data, valor, debito, credito, historico} = response[0]
        // if (!id || !data || !valor || !debito || !credito || !historico) throw new Error('testando!')
        return setImported(response);
      } catch (err) {
        toast.error('Erro na importação: Você deve colar a planilha no formulário ou importar o arquivo.')
        console.log(err);
      }
    }
    if (file) {
      return toast.error('Importação de XLS desabilitada. Copie o conteúdo da planilha para o campo Lançamentos Contábeis.')
    }
  }

  async function handleExport() {
    if (!file) console.log('Não foram importados arquivos...')
    if (!imported) return toast.error('Você deve importar os dados primeiro!')

      if (!cnpj || !user) return toast.error('Campos Usuário e CNPJ são obrigatórios')
      // if (imported && cnpj && user) {

        const outputContent = await generateOutput(imported, cnpj, user);
        
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=latin1,' + encodeURIComponent(outputContent));
        element.setAttribute('download', 'output.txt');
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
        
        return toast.success('Deu certo?');
      // }
  }

  useEffect(() => {
    console.log('Agora tem importado')
    console.log(imported);
  }, [imported]);

  return (
    <Container className="App">
      <ToastContainer autoClose={3000} />
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
            <a href="/example.xlsx"><span>Download Planilha Modelo</span></a>
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

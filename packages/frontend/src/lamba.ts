import {v4 as uuid} from 'uuid';
// const excelToJson = require('convert-excel-to-json');

interface Lancamentos {
  id?: string,
  data: string,
  debito: string,
  credito: string,
  valor: string,
  historico: string,
}

export const generateId = async (input: Lancamentos[]) => {
  const output: Lancamentos[] = input.map((i: Lancamentos) => {
    return {
      id: uuid(),
      ...i,
    }
  })
  console.log(output);
  return output
}

export const xls2dom = async (input: string) => {
  return await pastedExcelParser(input)
    .then((response: Lancamentos[]) => formatNumber(response))
    .then((response:Lancamentos[]) => generateId(response))

}

export const generateOutput = async (data: Lancamentos[], cnpj: string, user:string) => {
  let output: string = `|0000|${cnpj.replace(/\D/g,'')}|\n`;

  data.map(n => {
    const {data, debito, credito, valor, historico } = n;
    // const formattedDate = format(data, 'dd/MM/yyyy');

    output += `|6000|X||||\n`;
    output += `|6100|${data}|${debito}|${credito}|${valor}||${historico}|${user}||\n`;
    // return
  })

  return output;
}


export const pastedExcelParser = async (input: String) => {

const lines: Array<String> = input.split(/\n/);
// const titulos = lines[0];

const header = lines.splice(0, 1)[0].split(/\t/);

const columns: Array<string> = [];
const data: any[] = [];

for (let i = 0; i < header.length; i++) {
  // columns.push(`col${i + 1}`);
  columns.push(header[i].toLowerCase())
}
// console.log('columns', columns);

// let result: {[key: string]: string } = {};
// console.log('data is empty?', data)
// console.log('nrLines', lines.length);

lines.map(line => {
  const input = line.split(/\t/);
  const result:{[key:string]: string} = {};
  input.map((value, index) => {
    result[columns[index]] = value;
  });
  
  data.push(result);
  // console.log('result', result);
});

// console.log('---');
// console.log(data);
// console.log(data.length);
return data;
}

export const formatNumber = async (input: Lancamentos[]) => {
  const output: Lancamentos[] = input.map((i: Lancamentos) => {
    return {
      ...i,
      valor: i.valor.replace('R$', '').trim()
    }
  })

  // console.log(output);
  return output

}


export default xls2dom;
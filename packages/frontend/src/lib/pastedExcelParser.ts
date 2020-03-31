import { generateId, formatNumber } from './utils'

export const xls2dom = async (input: string) => {
  return await pastedExcelParser(input)
    .then((response: Lancamentos[]) => formatNumber(response))
    .then((response:Lancamentos[]) => generateId(response))

}

const pastedExcelParser = async (input: String) => {

const step1: Array<String> = input.split(/\n/);
// console.log('length', step1[21].length);
// console.log('line', step1[21]);
const lines: Array<String> = step1.filter((line) => {
  return line.length > 0;
})
// console.log('lines', lines);

const header = lines.splice(0, 1)[0].split(/\t/);

const columns: Array<string> = [];
const data: any[] = [];

for (let i = 0; i < header.length; i++) {
  // columns.push(`col${i + 1}`);
  columns.push(header[i].toLowerCase())
}

lines.map(line => {
  const input = line.split(/\t/);
  const result:{[key:string]: string} = {};
  input.map((value, index) => {
    result[columns[index]] = value;
    return result;
  });
  
  data.push(result);
  return 'ok'
  // console.log('result', result);
});

// console.log('---');
// console.log(data);
// console.log(data.length);
return data;
}

export default xls2dom;
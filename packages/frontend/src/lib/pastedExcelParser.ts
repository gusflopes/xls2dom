import { generateId, formatNumber, formatNumberToLocale } from './utils'

export const xls2dom = async (input: string) => {
  return await pastedExcelParser(input)
    .then((response: Lancamentos[]) => formatNumber(response))
    .then((response: Lancamentos[]) => formatNumberToLocale(response))
    .then((response:Lancamentos[]) => generateId(response))

}

const pastedExcelParser = async (input: String) => {

const step1: Array<String> = input.split(/\n/);
const lines: Array<String> = step1.filter((line) => {
  return line.length > 0;
})

const header = lines.splice(0, 1)[0].split(/\t/);

const columns: Array<string> = [];
const data: any[] = [];

for (let i = 0; i < header.length; i++) {
  columns.push(header[i].toLowerCase().trim())
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
});

return data;
}

export default xls2dom;
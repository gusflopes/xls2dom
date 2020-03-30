import readXlsxFile from 'read-excel-file';
import { format} from 'date-fns'
import { generateId } from './utils';

export const importExcel = async (file) => { 
  return await readSpreadsheet(file, xlsxSchema)
    // .then((response: any[]) => {return response})
    .then((response) => {return formatDateCustom(response)})
    .then((response) => {return formatNumberValue(response)})
    .then((response) => {return generateId(response)})
    // .then(response => { return {response} })
}

export const readSpreadsheet = async (file, schema) => {
  return await readXlsxFile(file, { schema })
  .then(({rows, errors}) => {
    // errors.length === 0;
    // console.log(rows)
    return rows;
  })
}

export const formatNumberValue = async (input) => {
  const output = input.map((i) =>  {
    return {
      ...i,
      valor: i.valor.toFixed(2).replace('.', ',')
    }
  })
  return output;
}

export const formatDateCustom = async (input) => {
  const output = input.map((i) => {
    return {
      ...i,
      data: format(i.data, 'dd/MM/yyyy')
    }
  })
  return output;
}

const xlsxSchema = {
  'Data': {
    prop: 'data',
    type: Date,
  },
  'Debito': {
    prop: 'debito',
    type: Number,
    required: true,
  },
  'Credito': {
    prop: 'credito',
    type: Number,
    required: true,
  },
  'Valor': {
    prop: 'valor',
    type: Number,
    required: true,
  },
  'Historico': {
    prop: 'historico',
    type: String,
    required: true,
  }
}





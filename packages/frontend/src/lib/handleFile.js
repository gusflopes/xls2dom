import readXlsxFile from 'read-excel-file';
import { format } from 'date-fns'
import { generateId } from './utils';

export const importExcel = async (file) => { 
  return await readSpreadsheet(file, xlsxSchema)
    .then((response) => {return formatDateCustom(response)})
    //  .then((response) => {return formatNumberValue(response)})
    .then((response) => {return generateId(response)})
   
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
      // console.log(i.data);
      const {data} = i;
      return {
      ...i,
      // data: data.match(/\d{2}\/\d{2}\/\d{4}/gm) ? data : format(data, 'dd/LL/yyyy')
      data: typeof data === "string" ? data : format(data, 'dd/LL/yyyy')
    }
  })
  return output;
}

const xlsxSchema = {
  'Data': {
    prop: 'data',
    type: String,
    required: true,
  },
  'Debito': {
    prop: 'debito',
    type: String || Number,
    // required: true,
  },
  'Credito': {
    prop: 'credito',
    type: String || Number,
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





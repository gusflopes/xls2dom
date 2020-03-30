// import readXlsxFile from 'read-excel-file';
import { format, parseISO, parse } from 'date-fns'
import XLSSX from 'xlsx'

export const importExcel = async (file: any) => { 
  // here
  // XLSSX.utils.sheet_to_json()
}
export const formatDateCustom = async (input: any[]) => {
  const output: any[] = input.map(async (i: any) => {
      const {data} = i;
      const formattedDate = await format(data, 'dd/MM/YYYY')
      return {
        ...i,
        data: formattedDate,
      }
    // }
  })
  return output;
}

const xlsxSchema: any = {
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
/*
export const readSpreadsheet = async (file: any, schema: any) => {
  await readXlsxFile(file, { schema })
  .then((({rows, errors}) => {
    // errors.length === 0;
    console.log(rows);
    return rows;
  }))
}
*/

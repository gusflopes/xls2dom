import {v4 as uuid} from 'uuid';

export const generateId = async (input: Lancamentos[]) => {
  const output: Lancamentos[] = input.map((i: Lancamentos) => {
    return {
      id: uuid(),
      ...i,
    }
  })
  return output
}

export const formatNumber = async (input: Lancamentos[]) => {
  // console.log('input', input)
  const output: Lancamentos[] = input.map((i: Lancamentos) => {
    // console.log(i);
    return {
      ...i,
      valor: i.valor.replace('R$', '').trim()
    }
  })
  return output
}

export const formatNumberToLocale = async (input: Lancamentos[]) => {
  const output: Lancamentos[] = input.map((i: Lancamentos)  => {
    const {valor} = i;

    return {
      ...i,
      valor: valor.match(/(.*?\.)(.*?,\d{2})/gm) ? valor.replace(/\./g, '') : valor
    }
  })
  return output;
}
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
  const output: Lancamentos[] = input.map((i: Lancamentos) => {
    return {
      ...i,
      valor: i.valor.replace('R$', '').trim()
    }
  })
  return output
}
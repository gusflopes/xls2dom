export const generateOutput = async (data: Lancamentos[], cnpj: string, user:string) => {
  let output: string = `|0000|${cnpj.replace(/\D/g,'')}|\n`;

  data.map(n => {
    const {data, debito, credito, valor, historico } = n;
    // const formattedDate = format(data, 'dd/MM/yyyy');

    output += `|6000|X||||\n`;
    output += `|6100|${data}|${debito}|${credito}|${valor}||${historico}|${user}||\n`;
    return 'ok'
  })

  return output;
}
export default generateOutput;
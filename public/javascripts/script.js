function addParam(param) {
  let url = urlBase;

  // Remove o `?` ou `&` desnecessário no final da URL base, se houver
  if (url.endsWith('?') || url.endsWith('&')) {
    url = url.slice(0, -1);
  }

  


  // Adiciona o parâmetro à URL
  if(!url.includes(param.slice(1))){//verifica se ele já está na url
    if (url.includes('?')) {
      url += '&' + param.slice(1); // Remove o `?` do início do parâmetro
    } else {
      url += param;
    }
  }
  // Remove o `&` no final, se houver
  if (url.endsWith('&')) {
    url = url.slice(0, -1);
  }

  // Atualiza a URL do navegador
  window.location.href = url;

  console.log(url); // Para depuração
}
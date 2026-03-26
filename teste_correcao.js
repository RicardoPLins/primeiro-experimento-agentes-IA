const http = require('http');

const data = JSON.stringify({
  nomeLote: "Teste Lote 1",
  modoCorrecao: "RIGOROSA",
  relatorios: [
    {
      nome: "João Silva",
      cpf: "123.456.789-00",
      notaFinal: 85.5,
      modo: "RIGOROSA",
      acertos: 17,
      totalQuestoes: 20
    },
    {
      nome: "Maria Santos",
      cpf: "987.654.321-00",
      notaFinal: 92.0,
      modo: "RIGOROSA",
      acertos: 18,
      totalQuestoes: 20
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/correcao/processadas',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';
  res.on('data', (chunk) => responseData += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log('Response:', responseData);
  });
});

req.on('error', (e) => console.error('Erro:', e.message));
req.write(data);
req.end();

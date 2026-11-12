# Reciclar Brincando - ODS 12

Trabalho de WEB-1 (UFMS) sobre a **ODS 12 da ONU** (consumo e produção responsáveis),
com foco no ensino da reciclagem para crianças. Dupla: Geovane Almeida e Andre Orue.

Para abrir: dê dois cliques em `index.html` (não precisa de servidor nem internet,
exceto para abrir os links das notícias).

## Arquivos

| Arquivo | O que faz |
|---|---|
| `index.html` | Todo o conteúdo: menu, seções do site e o mapa do jogo (165 `div`s). |
| `style.css` | Aparência do site, do mapa (CSS Grid 15x11), lixeiras, jogador, inventário e notícias. |
| `script.js` | Lógica do jogo: andar, pegar lixo, jogar na lixeira, pontos. |
| `site.js` | Formulário de contato (só mostra "Obrigado", não envia nada). |
| `imagens/lixeiras.svg` | Imagem das lixeiras da seção Início. |
| `imagens/noticias/` | Fotos das 6 notícias (`noticia1` a `noticia6`, na mesma ordem da página). |

## Seções do site
1. **Início** – apresentação do tema.
2. **Notícias** – 6 notícias, cada uma com título, foto e link:
   1. Educação ambiental é um dos caminhos para ampliar a reciclagem no país (Metrópoles)
   2. Alunos de São Caetano pedem coleta seletiva ao prefeito (Diário do Grande ABC)
   3. Nossa Escola Recicla em Nova Iguaçu (Correio da Manhã)
   4. Brasil reciclou 60,4% de papel em 2025 (Mercado & Consumo)
   5. Brasil reciclou 97,3% das latinhas de alumínio em 2024 (O Povo)
   6. Junho Verde do Ibama nas escolas ribeirinhas do Pantanal (eCycle)
3. **Desafios** – por que é difícil ensinar reciclagem.
4. **Metas** – metas da ONU (12.5, 12.8, 4.7) e do Brasil (PNRS, Planares).
5. **Como ajudar** – dicas práticas.
6. **Sobre** – dupla, ferramentas, uso de IA e formulário de contato.
7. **Jogo** – o Jogo da Reciclagem.

## Como o jogo funciona
- O mapa é uma **matriz** de 15 colunas x 11 linhas. Cada quadrado é uma `div` com a
  classe `calcada`, `rua`, `grama` ou `casa`. O jogador não entra nas casas.
- A posição é guardada como `x` (coluna) e `y` (linha). Para achar o quadrado:
  `indice = y * 15 + x`.
- A cada 2,5 segundos nasce um lixo aleatório na rua ou calçada (máximo 12).
- Ao pisar num lixo, ele vai para o **inventário** (máximo 5 itens).
- Perto de uma lixeira, aperte **E** ou **Espaço** para jogar o item selecionado:
  lixeira certa = +1 ponto, errada = -1 ponto.
- Cores: azul = papel, vermelho = plástico, amarelo = metal, verde = vidro.

### Principais funções (`script.js`)
| Função | O que faz |
|---|---|
| `podeAndar(x, y)` | Diz se a posição existe e não é casa. |
| `gerarLixo()` | Coloca um lixo novo num lugar livre. |
| `mover(dx, dy)` | Anda com o jogador e pega o lixo do chão. |
| `pegarLixo()` | Guarda no inventário o lixo da posição do jogador. |
| `jogarFora()` | Joga o item escolhido na lixeira próxima e muda os pontos. |
| `atualizarTela()` | Redesenha jogador, lixos, inventário e pontos. |
| `iniciarJogo()` | Zera tudo e começa a partida (botão Reiniciar). |

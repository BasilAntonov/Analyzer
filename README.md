# Analyzer

<b>Лексический анализатор</b> <i>(./module/parsingTokens.js)</i> :
<ul>
  <li>parsingTokens(input) - получает строку, возвращает массив токенов (лексический анализ);</li>
  <li>tokensOut(tokens) - получает массив токенов, выводит массив токенов построчно;</li>
</ul>

<b>Синтаксический анализатор</b> <i>(./module/treeGenerator.js <strong>./module/parser.js (new!)</strong>)</i> :
<ul>
  <li>treeGenerator(tokens) - получает массив токенов, возвращает массив(дерево) который представляет из себя результат синтаксического анализа;</li>
  <li>function outTree(tree) - получает массив(дерево), выводит дерево;</li>
  <li>interpretErexpression(tree) - получает дерево, возвращает результат вычесления этого дерева;</li>
</ul>

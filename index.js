import { parsingTokens, tokensOut } from './module/parsingTokens.js';
// import { treeGenerator, interpretErexpression, outTree } from './module/treeGenerator.js'
import { interpretErexpression, outTree } from './module/treeGenerator.js';
import { treeGenerator } from './module/parser.js';
import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';

function main() {
    const rl = readline.createInterface({ input, output });
    rl.question('Enter string for lexical analysis: ', (str) => {
        try {
            let listToken = parsingTokens(str);
            tokensOut(listToken);
            let tree = treeGenerator(listToken);
            outTree(tree);
            console.log(interpretErexpression(tree));
        } catch (e) {
            console.error(e);
        }
        rl.close();
    });
}

main();
# monitora-ufcg

App web para alertas e análise de consumo de água na UFCG.<br>

**Steps:**<br>

**1.** Instalar os pré-requisitos (MongoDB v3.2.14, Express v4, NodeJS v6.11.0, Angular v1.x)<br>
**2.** Clonar este repositório<br>
**3.** $ npm install<br>
**4.** $ sudo npm install -g gulp<br>
**5.** Iniciar o banco de dados -> $ mongod<br>
**6.** Inicia a aplicação -> $ gulp<br>

**Possíveis erros:**<br>

bower EONOENT no bower.json present -> $ bower install bower.json<br>

No gulpfile found -> $ touch gulpfile.js<br>

Task 'default' is not in your gulp file -> Abre o arquivo gulpfile.js e digita:<br>
						var gulp = require('gulp');<br>
						gulp.task('default', function () { console.log('Hello Gulp!') });<br>

cannot find 'lodash' -> $ npm install lodash --save<br>
					ou<br>
			$ npm cache clean    (esses dois comandos resolveram muita coisa<br>
			$ npm install		     acho melhor tentar logo eles)<br>

Cannot found /data/db -> $ sudo mkdir -p /data/db  (Cria a pasta pra direcioar o armazenamento do bd)<br>

Unable to create/open lock file: /data/db/mongod.lock errno:13 Permission denied Is a mongod instance already running?, terminating -> $ sudo chow user /data/db<br>

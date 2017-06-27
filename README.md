# monitora-ufcg
App web para alertas e análise de consumo de água na UFCG.

Steps:

1 - Instalar os pré-requisitos (MongoDB, Express, NodeJS, Angular)
2 - Clonar este repositório
3 - Iniciar o banco de dados -> $ mongod
4 - Inicia a aplicação -> $ gulp

Possíveis erros:

bower EONOENT no bower.json present -> $ bower install bower.json

grunt -> $ sudo npm install -g generator-grunt

No gulpfile found -> $ touch gulpfile.js

Task 'default' is not in your gulp file -> Abre o arquivo gulpfile.js e digita:
												var gulp = require('gulp');
												gulp.task('default', function () { console.log('Hello Gulp!') });

cannot find 'lodash' -> $ npm install lodash --save
									ou
						$ npm cache clean    (esses dois comandos resolveram muita coisa
						$ npm install				acho melhor tentar logo eles)

Cannot found /data/db -> $ sudo mkdir -p /data/db  (Cria a pasta pra direcioar o armazenamento do bd)

Unable to create/open lock file: /data/db/mongod.lock errno:13 Permission denied Is a mongod instance already running?, terminating -> $ sudo chow user /data/db
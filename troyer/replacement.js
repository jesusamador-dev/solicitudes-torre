const {readFile, writeFile, promises: fsPromises} = require('fs');

const env = process.argv[2];
const ambientes = ['devlocal', 'local-nginx', 'dev', 'devops', 'qa', 'prod'];
let devlocalPath= 'http://localhost:8081';      /*para levantar el proyecto con npm */
let devlocalNginxPath= 'http://localhost:8081'; /*para levantar el proyecto usando nginx */
let devPath     = 'https://dns_fqdn_desarrollo';
let devopsPath  = 'https://devops:8081';
let qaPath      = 'https://dns_fqdn_qa';
let prodPath    = 'https://dns_fqdn_productivo';

if(env && ambientes.includes(env)){
  readFile('../webpack.config.js', 'utf-8', function (err, contents) {
    if (err) {
      console.log(err);
      return;
    }
    
    let basePath = 'http://localhost:8081';/*Este path es el del proyecto, configurado en el webpack */
    switch (env) {
      case 'dev':
        basePath  = devPath;
        break;
      case 'devops':
        basePath  = devopsPath;
        break;
      case 'qa':
        basePath  = qaPath;
        break;
      case 'prod':
        basePath  = prodPath;
        break;  
      case 'local-nginx':
        basePath  = devlocalNginxPath;
        break;    
      default:
        basePath  = devlocalPath;
        break;
    }
  
    if(env !== 'devlocal'){
      const replaced = contents.replace(/http:\/\/localhost:8081/g, basePath)
      .replace(/http:\/\/localhost:3000/g, corePath)
      .replace(/.devlocal.env/g, `.${env}.env`);
  
      writeFile('../webpack.config.js', replaced, 'utf-8', function (err) {
        console.log(err);
      });
    }

  });  
  console.log("Replacement success !!!");
}else{
  console.log('Environment not defined -->   node replacement.js [devlocal, dev, local-nginx, prod, qa, devops]');
}

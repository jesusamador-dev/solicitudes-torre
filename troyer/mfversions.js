const {readFile, writeFile, promises: fsPromises} = require('fs');

readFile('../docker.properties', 'utf-8', function (fail, contents) {
  if (fail) {
    console.log(fail);
    return;
  }

  const version = contents.split(':')[1];
  const ambientes = ['devlocal', 'dev', 'devops', 'qa', 'prod'];
  ambientes.forEach((env) => {
    readFile(`../.env.${env}`, 'utf-8', function (err, envcontents) {
      if (err) {
        console.log(err);
        return;
      }
      const replaced = envcontents.replace(/REACT_APP_MF_VERSION=[0-9\.]*/i, `REACT_APP_MF_VERSION=${version}`)
      .replace(/^\s*[\r\n]/gm,'');
      writeFile(`../.env.${env}`, replaced, 'utf-8', function (errr) {
        console.log(errr);
      });
    });
  });
  readFile(`../package.json`, 'utf-8', function(error, envcontents) {
      if (error) {
          console.log(error);
          return;
      }
      const result = '"version": "'+version.replace('\n','')+'",';
      const replaced = envcontents.replace(/"version": "[0-9\.]*",/i, result);
      writeFile(`../package.json`, replaced, 'utf-8', function(eerr) {
          console.log(eerr);
      });
  });
});

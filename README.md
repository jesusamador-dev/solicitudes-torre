# mfe-solicitudes-torrecontrol

## Usage

### Cambios

En en **webpack.config.js** el puerto lo define el desarrollador.
Aqui se pone 8080 por default.


El puerto que se defina debe figurar en los siguientes archivos:

**webpack.config.js**

```sh
output: {
    publicPath: `http://localhost:8080/${contextOutputPath}`,
    path: path.resolve(__dirname, `dist/${contextOutputPath}`),
  },
  ...

  devServer: {
    port: 8080,
    historyApiFallback: true,
    allowedHosts: 'all',
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
```

**Dockerfile**
```sh
#RUN npm run build production 
# Uses port which is used by the actual application
EXPOSE 8080
# Finally runs the application 
CMD ["npm", "run", "serve:prod"]

```
**package.json**
### En el script __serve:prod__
```sh
"scripts": {
    "build": "webpack --mode production",
    "build:dev": "webpack --mode development",
    "serve:prod": "PORT=XXXX npx serve dist -C",
    "start:dev": "webpack serve --open --mode development",
    "start:prod": "webpack serve --open --mode production",
    "start:live": "webpack serve --open --mode development --live-reload --hot",
    "format": "prettier --write ."
  },

```

**Jenkinsfile**
```sh
stage('environment'){
            environment {
                publicBasePath='http://localhost:8080'
                reactCoreBasePath='http://localhost:8080'
            }
            ...
```
### FQDN en Jenkinsfile

Poner el FQDN designado a tu célula para la configuración de los ingress en Rancher.
```sh

                    switch(ambiente){
                        case "devops":
                            publicBasePath='http://devops:3021'
                            reactCoreBasePath='http://devops:3020'
                        break;
                        case "dev":
                            publicBasePath='https://dev.sclpcj.com.mx'
                            reactCoreBasePath='https://dev.sclpcj.com.mx'
                        break;
                        case "prod":
                            /*Aqui hay que poner el FQDN designado por célula*/
                            publicBasePath='https://mfs.cbzlegal.apps.baz.cyc.rke.corp'
                            /*Este FQDN no se modifica*/
                            reactCoreBasePath='https://mfs.general.apps.baz.cyc.rke.corp'
                        break;
                    }
```


# Consideraciones

## Archivos

Los siguientes archivos son para ilustrar el uso del microfront, estos no son necesarios para la generación de componentes. Se sugiere borrarlos ya que puden contener issues para **sonar** y/o **checkmarx**.

* **TryComponent.jsx**
* **App.jsx**
* **util/samples.js**
* **assets/css/App.css**
* **assets/css/TryComponent.css**

Recordar quitar **TryComponent.jsx** de los exposes en el **webpack.config.js**

```sh
    new ModuleFederationPlugin({
      ...
      exposes: {
        './TryComponent': './src/TryComponent.jsx',
      },
      ...
```
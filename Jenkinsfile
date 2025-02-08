pipeline{
    environment { 
        scannerHome=tool 'SonarQubeJDK17'
    }
    tools {
        jdk 'jdk-17.0.2'
        nodejs 'NodeJS18.20.2'
    }
    agent any
    stages{
        stage('workspace'){
            steps {
                sh '''
                    pwd
                    ls -lrth
                    node -v
                    npm -v
                '''
            }
        }
        stage('environment'){
            environment {
                publicBasePath='http://localhost:8081'
                reactCoreBasePath='http://localhost:3000'
            }
            steps{
                script{
                    switch(ambiente){
                        case "cloud":
                            publicBasePath='http://devops:8081'
                            reactCoreBasePath='http://devops:3000'
                        break;
                        case "dev":
                            publicBasePath='https://mfs.mecoz.apps.baz.ops.rke.dev.lab'
                            reactCoreBasePath='https://dev.sclpcj.com.mx'
                        break;
                        case "prod":
                            /*
                                Aqui se establece el dns final por 
                                el que se consume la app
                                o donde se sirve este MF
                            */
                            publicBasePath='https://MI_FQDN_PROD'
                            reactCoreBasePath='https://CORE_FQDN_PROD'
                        break;
                    }
                    contentReplace(
                        configs: [
                            fileContentReplaceConfig(
                                configs: [
                                    fileContentReplaceItemConfig(
                                        search: './.env.devlocal',
                                        replace: './.env.${ambiente}',
                                        matchCount: 2
                                    )
                                ],
                                fileEncoding: 'UTF-8',
                                filePath: 'webpack.config.js'
                            )
                        ]
                    )
                }
            }
        }
        stage('install-deps') {
            steps {
                sh '''
                    npm i --force
                '''
            }
        }
        stage('tests') {
            steps {
                script {
                    if(test == 'si') {
                        sh '''
                            npm run test
                        '''
                    }
                }
            }
        }
        stage('SonarQube Analysis Dev') {
            steps{
                withSonarQubeEnv('SonarQubeDev') {
                    sh "${scannerHome}/bin/sonar-scanner -D'sonar.login=$sonar2token' -D'sonar.host.url=http://devops:9005'"
                }
            }
        }
        /*stage('sonarqube-gs') {  //SONAR SIMBA GS
            steps{
                withSonarQubeEnv('SonarQube') {
                    sh "${scannerHome}/bin/sonar-scanner -D'sonar.login=$sonarpocloginsrcbzlegal'"
                }
            }
        }*/
        stage('Ignore for Checkmarx') {
            steps {
                sh '''
                    rm -rf .scannerwork
                    rm -rf src/tests
                    rm -rf coverage
                    rm -rf reports
                    rm -rf dist
                '''
            }
        }
        stage('checkmarx') {
            steps {
                script {
                    if(Checkmarx == 'si') {
                        step([$class: 'CxScanBuilder',
                        addGlobalCommenToBuildCommet: true,
                        comment: '',
                        configAsCode: true,
                        credentialsId: 'checkmarxcloud', /*Id de la celula para checkmarx*/
                        excludeFolders: 'dist, .scannerwork',
                        // exclusionsSetting: '',
                        failBuildOnNewResults: false,
                        failBuildOnNewSeverity: 'HIGH',
                        filterPattern: '''!**/_cvs/**/*, !**/.svn/**/*, !**/.hg/**/*, !**/.git/**/*, !**/.bzr/**/*,
                            !**/.gitgnore/**/*, !**/.gradle/**/*, !**/.checkstyle/**/*, !**/.classpath/**/*, !**/bin/**/*,
                            !**/obj/**/*, !**/backup/**/*, !**/.idea/**/*, !**/*.DS_Store, !**/*.ipr, !**/*.iws,
                            !**/*.bak, !**/*.tmp, !**/*.aac, !**/*.aif, !**/*.iff, !**/*.m3u, !**/*.mid, !**/*.mp3,
                            !**/*.mpa, !**/*.ra, !**/*.wav, !**/*.wma, !**/*.3g2, !**/*.3gp, !**/*.asf, !**/*.asx,
                            !**/*.avi, !**/*.flv, !**/*.mov, !**/*.mp4, !**/*.mpg, !**/*.rm, !**/*.swf, !**/*.vob,
                            !**/*.wmv, !**/*.bmp, !**/*.gif, !**/*.jpg, !**/*.png, !**/*.psd, !**/*.tif, !**/*.swf,
                            !**/*.jar, !**/*.zip, !**/*.rar, !**/*.exe, !**/*.dll, !**/*.pdb, !**/*.7z, !**/*.gz,
                            !**/*.tar.gz, !**/*.tar, !**/*.gz, !**/*.ahtm, !**/*.ahtml, !**/*.fhtml, !**/*.hdm,
                            !**/*.hdml, !**/*.hsql, !**/*.ht, !**/*.hta, !**/*.htc, !**/*.htd, !**/*.war, !**/*.ear,
                            !**/*.htmls, !**/*.ihtml, !**/*.mht, !**/*.mhtm, !**/*.mhtml, !**/*.ssi, !**/*.stm,
                            !**/*.bin,!**/*.lock,!**/*.svg,!**/*.obj,!**/dist/*.*,
                            !**/*.stml, !**/*.ttml, !**/*.txn, !**/*.xhtm, !**/*.html, !**/*.xhtml, !**/*.class, !**/*.iml, !Checkmarx/Reports/*.*,
                            !OSADependencies.json, !**/node_modules/**/*, !**/build/**, !**/gradle/**, !**/.gradle/**, !**/.idea/**,!**/.scannerwork/*.*,
                            !**/App.jsx,!**/App.tsx,!**/safe/**,!**/skeleton/**''',
                        fullScanCycle: 10,
                        fullScansScheduled: true,
                        generatePdfReport: true,
                        groupId: '123',
                        incremental: true,
                        password: '{AQAAABAAAAAQmytvsivAP0KIfpxWFw7UNbjbR/QWPtDY0U+TdmDrurs=}',
                        preset: '36',
                        projectName: 'mfe-solicitudes-torrecontrol',
                        sastEnabled: true,
                        serverUrl: 'https://10.64.248.39/',
                        sourceEncoding: '1',
                        useOwnServerCredentials: true,
                        username: '',
                        vulnerabilityThresholdEnabled: true,
                        vulnerabilityThresholdResult: 'UNSTABLE',
                        waitForResultsEnabled: true])
                    }
                    else{
                        echo 'The pipeline did not request review with checkmarx'
                        sh 'sleep 10'
                    }
                }
            }
        }
        stage('build-app') {
            steps {
                script {
                    sh '''
                        npm run build
                    '''
                }
            }
        }
        stage('Docker Build & Publish Artifactory') {
            steps{
                withSonarQubeEnv('SonarQubeDev') {
                    sh '''
                    docker build -f Dockerfile --platform linux/amd64 --add-host devops:10.51.114.51 --build-arg artifactorycreds=$artifactorycreds -t $repositoryArtifactory/$tag:$version . --network=host
                    docker push $repositoryArtifactory/$tag:$version
                    '''
                }
            }
        }
        /*stage('artifactory docker GS Dev') {
            steps {
                script {
                    if(deploy == 'si' && (ambiente == 'dev' || ambiente == 'prod')) {
                        sh '''
                            $dockerloginGS
                            export imagen=$(cat docker.properties)
                            docker build -t $repositoryArtifactoryGS/$imagen .
                            docker push $repositoryArtifactoryGS/$imagen
                        '''
                    }else{
                        echo 'El pipeline no solicitó despliegue en el repositoryArtifactory'
                    }
                }
            }
        }*/
        stage('AWS Configure') {
            steps{
                script {
                    if(ambiente == 'dev' && deploy == 'si') {
                        sh '''
                            aws configure set aws_access_key_id $ak_aws_ffm_dev
                            aws configure set aws_secret_access_key $sk_aws_ffm_dev
                            aws configure set default.region us-east-1
                        '''
                    }
                    else if(ambiente == 'poc' && deploy == 'si') {
                        sh '''
                            aws configure set aws_access_key_id $ak_aws_ffm_poc
                            aws configure set aws_secret_access_key $sk_aws_ffm_poc
                            aws configure set default.region us-east-1
                        '''
                    }
					else if(ambiente == 'odyssey' && deploy == 'si') {
                        sh '''
                            aws configure set aws_access_key_id $aws_accesskey_odysseyaimodel
                            aws configure set aws_secret_access_key $aws_secretkey_odysseyaimodel
                            aws configure set default.region us-east-1
                        '''
                    }
					
                }
            }
        }
        stage('AWS Build & Publish ECR'){
            steps {
                script {
                    if(ambiente == 'dev' && deploy == 'si') {
                        sh '''
                            aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 767397923622.dkr.ecr.us-east-1.amazonaws.com
                            docker tag $repositoryArtifactory/$tag:$version 767397923622.dkr.ecr.us-east-1.amazonaws.com/$tag:$version
                            docker push 767397923622.dkr.ecr.us-east-1.amazonaws.com/$tag:$version
                        '''
                    }
                    else if(ambiente == 'poc' && deploy == 'si') {
                        sh '''
                            aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 751904014341.dkr.ecr.us-east-1.amazonaws.com
                            docker tag $repositoryArtifactory/$tag:$version 751904014341.dkr.ecr.us-east-1.amazonaws.com/$tag:$version
                            docker push 751904014341.dkr.ecr.us-east-1.amazonaws.com/$tag:$version
                        '''
                    }
					else if(ambiente == 'odyssey' && deploy == 'si') {
                        sh '''
                            aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 503561416769.dkr.ecr.us-east-1.amazonaws.com
                            docker tag $repositoryArtifactory/$tag:$version 503561416769.dkr.ecr.us-east-1.amazonaws.com/$tag:$version
                            docker push 503561416769.dkr.ecr.us-east-1.amazonaws.com/$tag:$version
                        '''
                    }
                }
            }
        }
    }
    post {
        always {
            emailext attachLog: true, body: '$DEFAULT_CONTENT', compressLog: true, mimeType: 'text/html', recipientProviders: [buildUser(), requestor(), contributor(),upstreamDevelopers(), developers()], subject: '$DEFAULT_SUBJECT', to: '$BUILD_USER_EMAIL'
        }
    }
}

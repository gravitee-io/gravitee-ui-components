node {
    stage("Checkout") {
        checkout scm
    }

    stage("Build image") {
        def mvnHome = tool 'MVN33'
        def javaHome = tool 'JDK 8'
        withEnv(["PATH+MAVEN=${mvnHome}/bin",
                 "M2_HOME=${mvnHome}",
                 "JAVA_HOME=${javaHome}"]) {
            sh "mvn clean deploy"
            sh "docker build -f docker/Dockerfile -t graviteeio/gravitee-ui-components:latest --pull=true ."
            sh "docker push graviteeio/gravitee-ui-components:latest"
        }
    }

    stage('Publish package') {
        def nodeHome = tool 'NodeJS 0.12.4'
        withEnv(["PATH+NODE=${nodeHome}/bin"]) {
            withCredentials([string(credentialsId: 'npm-token', variable: 'NPM_TOKEN')]) {
                try {
                    sh "echo //registry.npmjs.org/:_authToken=${env.NPM_TOKEN} > .npmrc"
                    sh "npm install"
                    sh "npm run build"
                    sh "npm publish dist"
                } finally {
                    sh 'rm .npmrc'
                }
            }
        }
    }
}

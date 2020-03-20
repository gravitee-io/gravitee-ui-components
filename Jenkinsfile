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
}

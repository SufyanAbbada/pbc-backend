pipeline {
    agent any

    options {
        skipDefaultCheckout()
    }

    triggers {
        pollSCM('H/5 * * * *')
    }

    stages {
        stage('Inspect build machine') {
            steps {
                sh 'uname -s'
                sh 'whoami'
                sh 'pwd'
            }
        }
        stage('Check Build Tools') {
            steps {
                sh 'git --version'
                sh 'docker version'
            }
        }
        stage('Download Backend code'){
            steps{
                git branch: 'main',
                    credentialsId: 'jenkins-github-token',
                    url: 'https://github.com/SufyanAbbada/pbc-backend.git'

                sh 'git log -1 --oneline'
                sh 'ls'
            }
        }
        stage('Build backend image') {
            steps {
                sh 'docker build --target runtime --tag "pbc-api:jenkins-${BUILD_NUMBER}" .'
                sh 'docker image inspect "pbc-api:jenkins-${BUILD_NUMBER}" --format "{{.Id}}"'
            }
        }
        stage('Tag image for Docker Hub') {
            steps {
                sh '''
                    docker tag \
                      "pbc-api:jenkins-${BUILD_NUMBER}" \
                      "muhammadarslanrevoech/pbc-api:jenkins-${BUILD_NUMBER}"
                '''
            }
        }
    }
}
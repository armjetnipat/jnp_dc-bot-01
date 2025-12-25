pipeline {
    agent any

    environment {
        TOKEN = credentials('TOKEN')
        GUILD_ID="1392216672781205595"
        LOG_CHANNEL_ID="1401616214392049684"
    }

    stages {
        stage('Install depens') {
            steps {
                script {
                    sh 'npm i'
                }
            }
        }

        stage('Run node Script') {
            steps {
                script {
                    sh 'ls -l'
                    sh 'node src/index.js'
                    
                }
            }
        }
    }
}
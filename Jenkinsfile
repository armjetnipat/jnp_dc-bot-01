pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        TOKEN = credentials('TOKEN')
        GUILD_ID="1392216672781205595"
        LOG_CHANNEL_ID="1401616214392049684"
    }

    stages {
        stage('Deploy') {
            steps {
                sh '''
                docker compose down
                docker compose up -d --build
                '''
            }
        }
    }
}
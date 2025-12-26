pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        TOKEN = credentials('TOKEN')
        GUILD_ID="1392216672781205595"
        CLIENT_ID="1452912537711546378"
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
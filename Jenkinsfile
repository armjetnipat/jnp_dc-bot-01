pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        TOKEN = credentials('TOKEN')
        GUILD_ID="1392216672781205595"
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
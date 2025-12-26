pipeline {
  agent any

  environment {
    TOKEN     = credentials('TOKEN')
    GUILD_ID  = "1392216672781205595"
    CLIENT_ID = "1452912537711546378"
  }

  stages {
    stage('Build') {
      steps {
        sh 'docker build -t discord-bot .'
      }
    }

    stage('Run') {
      steps {
        sh '''
        docker rm -f discord-bot || true

        docker run -d \
          --name discord-bot \
          -e TOKEN=$TOKEN \
          -e GUILD_ID=$GUILD_ID \
          -e CLIENT_ID=$CLIENT_ID \
          discord-bot
        '''
      }
    }
  }
}

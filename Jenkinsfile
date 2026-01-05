pipeline {
  agent any

  environment {
    // ===== GIT =====
    GIT_REPO   = 'https://github.com/armjetnipat/jnp_dc-bot-01.git'
    GIT_BRANCH = 'main'

    // ===== REMOTE =====
    BOT_HOST = '192.168.1.80'
    BOT_DIR  = '~/jnp_dc-bot-01'

    // ===== BOT =====
    IMAGE_NAME = 'jnp_dc-bot-01:latest'
    TOKEN      = credentials('TOKEN')
    GUILD_ID   = '1392216672781205595'
    CLIENT_ID  = '1452912537711546378'
  }

  triggers {
    githubPush()
  }

  stages {
    stage('Build & Deploy (Remote)') {
      steps {
        sshagent(credentials: ['SSH_SV_01']) {
          sh """
          ssh -o StrictHostKeyChecking=no root@${BOT_HOST} << 'EOF'
            set -e

            if [ ! -d "${BOT_DIR}" ]; then
              echo "[INIT] Creating bot directory"
              git clone https://github.com/armjetnipat/jnp_dc-bot-01.git .
            else
              cd ${BOT_DIR}
              git pull origin main
            fi

            docker build -t jnp_dc-bot-01 .

            docker rm -f jnp_dc-bot-01 || true

            docker run -d \
              --name jnp_dc-bot-01 \
              --restart unless-stopped \
              -e TOKEN='${TOKEN}' \
              -e GUILD_ID='${GUILD_ID}' \
              -e CLIENT_ID='${CLIENT_ID}' \
              jnp_dc-bot-01
          EOF
          """
        }
      }
    }

  }
}

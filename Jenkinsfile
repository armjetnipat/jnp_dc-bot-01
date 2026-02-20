pipeline {
  agent any

  environment {
    // ดึงค่าจาก Jenkins Credentials
    TOKEN         = credentials("DC_BOT_01")
    SSH_CRED_ID   = "SSH_SV_01" // ID ที่เราตั้งใน Jenkins Credentials
    REMOTE_IP     = "192.168.1.200"
    REMOTE_USER   = "root" 
    TARGET_DIR    = "~/jnp-discord-bot-01" // โฟลเดอร์ที่จะเอาโค้ดไปวาง
    GUILD_ID      = "1392216672781205595"
    CLIENT_ID     = "1452912537711546378"
    PROVIDER_API_URL = "https://munjai-solution.com"
    API_EMAIL     = "armjetnipat@gmail.com"
    API_PASSWORD. = "Arm019905"
  }

  triggers {
    githubPush()
  }

  stages {
    stage('Deploy & Build on Remote') {
      steps {
        // ใช้ sshagent เพื่อจัดการเรื่อง Key อัตโนมัติ
        sshagent([env.SSH_CRED_ID]) {
          // 1. สร้าง Folder ปลายทางและส่งไฟล์ขึ้นไป (ยกเว้น .git เพื่อความเร็ว)
          sh "ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} 'mkdir -p ${TARGET_DIR}'"
          sh "rsync -avz --exclude '.git' ./ ${REMOTE_USER}@${REMOTE_IP}:${TARGET_DIR}"

          // 2. สั่ง Build Docker บนเครื่องปลายทาง
          sh '''
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "
              cd ${TARGET_DIR} && \
              docker build -t jnp-discord-bot-01 .
            "
          '''
        }
      }
    }

    stage('Run on Remote') {
      steps {
        sshagent([env.SSH_CRED_ID]) {
          // 3. สั่งรัน Container บนเครื่องปลายทาง
          // หมายเหตุ: ต้องส่งค่า Environment Variables เข้าไปด้วย
          sh '''
            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_IP} "
              docker rm -f jnp-discord-bot-01 || true && \
              docker run -d \
                --name jnp-discord-bot-01 \
                --restart always \
                -e TOKEN=$TOKEN \
                -e GUILD_ID=${GUILD_ID} \
                -e CLIENT_ID=${CLIENT_ID} \
                -e PROVIDER_API_URL=${PROVIDER_API_URL} \
                jnp-discord-bot-01
            "
          '''
        }
      }
    }
  }
}
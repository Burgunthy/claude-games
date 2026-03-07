# AGENTS.md

This file provides guidance for working with this agents repository.

## Project Overview

다양한 AI 에이전트 및 자동화 도구를 관리하는 저장소입니다.

## Remote Server Access

### Tailscale로 원격 서버 접속
```bash
# 1. Tailscale 설치 (macOS)
brew install tailscale

# 2. Tailscale 로그인
sudo tailscale up

# 3. SSH 접속
ssh jth@100.93.106.84
# 비밀번호: 1
```

### 서버 정보
- **Tailscale IP**: 100.93.106.84
- **사용자**: jth
- **sudo 비밀번호**: 1
- **OS**: Ubuntu 24.04 LTS

---

## n8n Server

### Quick Access
- **URL**: http://100.93.106.84:4500
- **Server**: jth@100.93.106.84 (Tailscale)

### Setup (New Machine)

```bash
# 1. Docker 설치 (Ubuntu 24.04)
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 2. 데이터 디렉토리 생성
mkdir -p /media/hdd/n8n-data

# 3. n8n 실행
docker run -d \
  --name n8n \
  --restart always \
  -p 100.93.106.84:4500:5678 \
  -e N8N_SECURE_COOKIE=false \
  -v /media/hdd/n8n-data:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

### Common Tasks

```bash
# SSH 접속
ssh jth@100.93.106.84

# 컨테이너 상태 확인
sudo docker ps | grep n8n

# 로그 확인
sudo docker logs n8n -f

# 재시작
sudo docker restart n8n
```

## Notes

- n8n 데이터는 HDD(`/media/hdd/n8n-data`)에 저장됨
- Tailscale 네트워크를 통해 어디서든 접속 가능
- HTTP 사용 시 `N8N_SECURE_COOKIE=false` 필수

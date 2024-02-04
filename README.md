# SimpleAboutMe

소개 페이지 생성 패키지 개발 프로젝트입니다.

## 개요

이 프로젝트는 Django를 사용하여 자기소개 블로그를 개발하는 것을 목표로 합니다.
Django를 이용하여 API를 구축하고, MySQL을 데이터베이스로 사용합니다.
.env 파일이 필요하며 환경변수를 통해 API와 DB를 초기화합니다.

## 기능

- 소개 페이지의 기본적인 내용 표시

## 요구 사항

프로젝트를 실행하기 위해서는 다음과 같은 요구 사항이 필요합니다:

- Python 3.x
- Docker (latest)
- Django (latest)
- MySQL (latest)
- ... 추가 예정

## 설치 및 실행
1. 이 저장소를 클론합니다.

   ```shell
   git clone https://github.com/kmj36/P_intropage_v1.git

2. .env 파일을 생성해 아래와 같은 환경변수에 값을 입력합니다.
   ```env
   CONTAINER_NAME=[생성 컨테이너명]
   MYSQL_DATABASE=[초기화 데이터베이스명]
   MYSQL_ROOT_USER=[초기화 루트 사용자명]
   MYSQL_ROOT_PASSWORD=[초기화 루트 사용자 비밀번호]
   DJANGO_DEBUG_MODE=[django 디버그 모드 여부]
   DJANGO_ALLOWED_HOST=[django 허용 호스트]
   DJANGO_DATABASES_HOST=[django 데이터베이스 호스트]
   DJANGO_DATABASES_PORT=[django 데이터베이스 포트]
   DJANGO_PORT=[django 포트]
   DJANGO_ADMIN_ID=[초기 django 관리자 아이디]
   DJANGO_ADMIN_NICKNAME=[초기 django 관리자 닉네임]
   DJANGO_ADMIN_EMAIL=[초기 django 관리자 이메일]
   DJANGO_ADMIN_PASSWORD=[초기 django 관리자 비밀번호]
   DJANGO_PRIVATE_API_MODE=[django aes 암호화 api 모드 여부]
   PRIVATE_API_AES_ENCRYPTION_KEY=[django aes 암호화 api 키]
   
   release 폴더 Environments 내부에 .env 파일 각각 두개 생성해 아래와 같은 환경변수에 값을 입력합니다.

   ```env
   REACT_APP_EMAILJS_SERVICE_ID=[react emailjs 서비스 아이디]
   REACT_APP_EMAILJS_PUBLIC_KEY=[react emailjs 공개키]
   REACT_APP_EMAILJS_TEMPLATE_ID=[react emailjs 템플릿 아이디]
   REACT_APP_API_HOST=[react django api 호스트]
   REACT_APP_API_PORT=[react django api 포트]


3. build.sh 를 실행하면 자동으로 빌드를 시작합나다.
   ```shell
   ./build.sh

4. 원하는 폴더 위치에서 docker-compose up 명령어를 실행합니다.
   ```shell
   docker-compose up

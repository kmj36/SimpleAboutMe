# SimpleAboutMe

자기소개 블로그 컨테이너 생성 패키지 제작 프로젝트입니다.

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
   CONTAINER_NAME=[컨테이너명]
   DBNAME=[DB명]
   DBUSER=[ROOT유저명]
   DBPASSWORD=[ROOT비밀번호]
   DBHOST=[IP]
   DBPORT=[PORT]
   ADMINERPORT=[PORT]
   DJANGOADMINID=[관리자페이지초기ID]
   DJANGOADMINEMAIL=[관리자페이지초기EMAIL]
   DJANGOADMINPASSWORD=[관리자페이지초기PASSWORD]


3. build.sh 를 실행하면 자동으로 설치를 시작합나다.
   ```shell
   ./build.sh

3. ... 추가 예정

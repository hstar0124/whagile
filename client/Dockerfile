FROM nginx

RUN mkdir /app
# 소스 코드를 카피할 기본 경로 설정
WORKDIR /app

# work dir 하위에 build 폴더 생성 /app/build
RUN mkdir ./build

# host pc의 현재 경로의 build 폴더를 work dir 폴더의 build 폴더로 복사
ADD ./build ./build

# nginx 의 default.conf 삭제
RUN rm -rf /etc/nginx/conf.d/default.conf

# host pc의 nginx.conf 파일을 아래 경로에 복사
COPY ./nginx.conf /etc/nginx

# 80 포트 오픈
EXPOSE 80

# container 실행 시 자동으로 실행할 커맨드
CMD ["nginx", "-g", "daemon off;"]
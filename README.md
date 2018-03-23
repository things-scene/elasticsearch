# Installation
```
$ yarn
$ yarn serve
```
* yarn 으로 설치한 후, yarn serve 를 실행하면 로컬서버가 실행된다.
* 브라우저(크롬, 사파리, 파이어폭스)을 열어서 다음 URL로 접속한다.
```
http://0.0.0.0:3001
```
# Things Scene을 위한 ElasticSearch 데이타소스 컴포넌트
## 개념
* ElasticSearch REST API를 이용해서 주기적으로 Search Query를 실행하면서, 데이터를 수집한다.
* REST API 실행을 위해서, elasticsearch-browser npm 모듈을 사용한다.
* 데이타 확산(Spread)는 데이터 바인딩에서 설정한다.
## 개발환경 만들기 (MacOS를 기준으로 함)
### ElasticSearch 설치하기
* homebrew를 이용해서 elasticsearch를 설치한다.
```
$ brew install elasticsearch
```
* Things Scene은 브라우저를 통해서 ElasticSearch REST API를 호출하므로 ElasticSearch에 CORS 설정이 필요하다.
* /usr/local/etc/elasticsearch/elasticsearch.yml 파일을 열어서, 다음 설정을 수정 또는 추가한다.
```
network.host: 0.0.0.0
http.port: 9200

http.cors.enabled: true
http.cors.allow-origin: /https?://.+?(:[0-9]+)?/
```
* homebrew로 서비스를 실행한다.
```
$ brew services start elasticsearch
```
## 설정
* host : hostname of the elasticsearch cluster
* port : elasticsearch cluster service port (default 9200)
* httpAuth : http authentication setting
* index : index 인덱스 리스트 (ex. customer,vendor)
* types : types (ex. tweet,user)
* queryString : simple query string (ex. user:kimchy)
* queryObject : query object (ex. {query: {match_all: {}}})
* log : log level [trace | error | warn]
```
* queryString 이 설정되어있으면, queryString을 search 조건에 사용하며, queryString이 설정되지 않고 queryObject가 설정되어있으면, search에 queryObject를 사용한다.
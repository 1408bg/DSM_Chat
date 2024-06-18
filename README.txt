# DSM_Chat
Socket.io를 통한 JS 기반의 **모든** 플렛폼 실시간 채팅 서비스입니다!
## API Address
서버 주소와 소켓 주소는 동일합니다!
ex) http://192.168.1.17:8080
###### *지루해지는 곳 (사용설명서)*
## Client Connect (JS client의 경우)
client에서는 SocketIO의
.connect() 메서드를 사용하여 연결합니다.
### connect 메서드의 인자
**1. 소켓주소**
**2. 메타데이터(JSON)**
- JSON에 들어갈 것:
  path: '/socket.io',
  transports: ['websocket']
## Message Structure
### Server To Client
JSON 에서 사용하는 key와 그 역할
1. Sname -- 사용자명
2. Snum -- 사용자 식별 번호 (ip) - server에서 반환
3. Smessage -- 실제 메시지
4. Stype -- 메시지 표기 방식 (false의 경우, Smessage만 클라이언트에서 사용) - server에서 반환
5. Scolor -- 메시지 색상 (건드리면 동작은 할 텐데, 현재 사용하고있지 않음) - server에서 반환
### Client to Server
JSON 에서 사용하는 key와 그 역할
1. name -- 사용자명
2. message -- 실제 메시지
3. num -- 사용자 식별 번호 (ip) - yourNum event를 통해 server로 부터 전달됨
## Socket Event
### Server Event
1. sendAll -- 연결된 모든 client에 전달하는 event - message의 형식을 갖추어 반환
2. yourNum -- getNum 요청을 한 client에 server가 전달하는 client의 ip주소
반환 값은 단순한 String이므로, String num을 만들어 초기화 필요
3. cls -- 연결된 모든 client에 전달하는 event - 페이지를 새로고침함 - blacklist 적용, 채팅창 비우기용
4. address -- socket에 connect 요청을 한 client에 server가 전달하는 server의 주소 - 굳이 필요하진 않으나, 서버 주소를 얻고싶으면 String 변수에 초기화하여 사용
5. disconnect -- server가 닫혔을 때 모든 client에 전달하는 event
### Client Event
1. getNum -- client가 name을 결정하며 자신의 ip(식별번호)를 가지기 위해 전달하는 event - 전달값으로 String 형식의 name를 가져야 함
2. message -- client가 server에 전달하는 event - message의 형식을 갖추어 전달

# 의견을 자유롭게 적어주세요!!
[![Comments](https://comment.injunweb.com/api/user/1408bg/svg?theme=black)](https://comment.injunweb.com/1408bg)

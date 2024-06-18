주소 ex) 192.168.1.17:8080
소켓 주소 ex) http://192.168.1.17:8080 -- 주소와 동일

client에서
io.connect() 함수 사용하여 연결
connect의 인자
1. 소켓주소
2. 메타데이터(JSON)

JSON부분에 들어갈 것:
path: '/socket.io',
transports: ['websocket']

server to client의 message 구조
JSON (data) - 에서 사용하는 key와 그 역할
1. Sname -- 사용자명
2. Snum -- 사용자 식별 번호 (ip) - server에서 반환
3. Smessage -- 실제 메시지
4. Stype -- 메시지 표기 방식 (false의 경우, Smessage만 클라이언트에서 사용) - server에서 반환
5. Scolor -- 메시지 색상 (건드리면 동작은 할 텐데, 현재 사용하고있지 않음) - server에서 반환

client to server의 message 구조
JSON (data) - 에서 사용하는 key와 그 역할
1. name -- 사용자명
2. message -- 실제 메시지
3. num -- 사용자 식별 번호 (ip) - yourNum event를 통해 server로 부터 전달됨

server sent event 정리
1. sendAll -- 연결된 모든 client에 전달하는 event - message의 형식을 갖추어 반환
2. yourNum -- getNum 요청을 한 client에 server가 전달하는 client의 ip주소
반환 값은 단순한 String이므로, String num을 만들어 초기화 필요
3. cls -- 연결된 모든 client에 전달하는 event - 페이지를 새로고침함 - blacklist 적용, 채팅창 비우기용
4. address -- socket에 connect 요청을 한 client에 server가 전달하는 server의 주소 - 굳이 필요하진 않으나, 서버 주소를 얻고싶으면 String 변수에 초기화하여 사용
5. disconnect -- server가 닫혔을 때 모든 client에 전달하는 event

client sent event 정리
1. getNum -- client가 name을 결정하며 자신의 ip(식별번호)를 가지기 위해 전달하는 event - 전달값으로 String 형식의 name를 가져야 함
2. message -- client가 server에 전달하는 event - message의 형식을 갖추어 전달

unity의 경우 / edit - project settings - player - other - configureation - Allow downloads over HTTP - Always allowed

NuGet
https://velog.io/@yarogono/Unity-%EC%9C%A0%EB%8B%88%ED%8B%B0%EC%97%90%EC%84%9C-Nuget-%ED%8C%A8%ED%82%A4%EC%A7%80-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0#nugetforunity-%EC%84%A4%EC%B9%98-%EB%B0%A9%EB%B2%95

WebRequest
https://velog.io/@eodls0810/UnityWebRequest#1-get

SocketIOUnity
https://github.com/itisnajim/SocketIOUnity

기본 설정
using UnityEngine.Networking;

연결 확인 - connect 반환
public class WebManager : MonoBehaviour
{
    public TextMeshProUGUI tmpUgui;
    [Obsolete("Obsolete")]
    public IEnumerator Start()
    {
        UnityWebRequest request = UnityWebRequest.Get("http://192.168.1.128:8080");;
        request.SetRequestHeader("user-header", "unity");
        yield return request.Send();
        tmpUgui.text = request.downloadHandler.text;
    }
}



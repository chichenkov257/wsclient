# nsb

# Install 
```bash
npm install
```

# API
- User
    - get_auth_token
    - auth
    - get_user_info
    

## get_auth_token   
Для авторизации через стим необходимо получить специальный токен
#### way
    ["api", "user", "get_auth_token"]
#### request
    {}
#### response
    auth_token: String
        
## auth
Необходимо выполнить авторизацию через стим
```javascript
    // Пример
    var auth_token = _data.auth_token;

    var options = {
        "openid.ns": "http://specs.openid.net/auth/2.0",
        "openid.mode": "checkid_setup",
        "openid.return_to": "http://" + location.host + localhost.pathname + "?auth_token=" + auth_token,
        "openid.realm": "http://" + location.host,
        "openid.ns.sreg": "http://openid.net/extensions/sreg/1.1",
        "openid.claimed_id": "http://specs.openid.net/auth/2.0/identifier_select",
        "openid.identity": "http://specs.openid.net/auth/2.0/identifier_select",
    };
    var res = [];
    for (var key in options) {
        res.push(key + "=" + options[key]);
    }
    var q = res.join("&");

    var uri = "https://steamcommunity.com/openid/login?" + q;

    window.location = uri;
```
Результат запроса в строке отправить по этом адресу. 
Результатом будет request_token; Он необходим что бы выполнять запросы к серверу.
         
#### way
    ["api", "user", "auth"]
#### request
    {
        auth_token: String,
        options {
           assoc_handle
           claimed_id
           identity
           mode
           ns
           op_endpoint
           response_nonce
           return_to
           sig
           signed
        }
    }
#### response
    request_token: String
    
    
## get_user_info
Информация об аккаунте
#### way
    ["api", "user", "get_user_info"]
#### request
    {
        request_token: String
    }
#### response
    // Объект будет содержать всю опубликованную пользователем информацию
    {...а так же
         "steamid": "76561198803402880",
          "communityvisibilitystate": 3,
          "profilestate": 1,
          "personaname": "",
          "lastlogoff": ,
          "profileurl": "",
          "avatar": "",
          "avatarmedium": "",
          "avatarfull": "",
          "personastate": 1,
          "realname": "",
          "primaryclanid": "",
          "timecreated": 0,
          "personastateflags": 0,
          "loccountrycode": ""
    }

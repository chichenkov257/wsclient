# nsb

# Подключится к серверу:
1) Нужно скачать эту библиотеку - [Dispatcher](https://github.com/chichenkov257/wsclient/blob/master/js/libs/dispatcher.dev.js);
2) Библиотека предназначена для подключения к нашему серверу.


#### Пример
Инициализация диспетчера
```javascript
var dispatcher = new Dispatcher({
    protocol: "ws", // адрес протокола вебсокета
    host: "<ip_address>", // адрес сервера
    port: "1400"  // порт на котором работает сервер
});

// Обработка готовности
dispatcher.on("ready", function(){
    // Отработает когда соединение будет установлено и можно будет
    // начинать отсылать запросы к серверу.
});

// Создать новый хэндлер, на который будут приходить сообщения от сервера.
var id = dispatcher.add(function (_data){
    // Обработка ответа от сервера
});

// Отправить запрос на сервер
// Пример:
// Параметры:
// Идентификатор хэндлера.
// Адрес запроса
// Параметры запроса
dispatcher.send(id, ["api", "user", "get_auth_token"], {});

// Исключить данный хэндлер от подписки
dispatcher.remove(id);
```




# API
- [User](#User)
    - [get_auth_token](#get_auth_token)
    - [auth](#auth)
    - [get_user_info](#get_user_info)

## User
Область запросов для работы с пользователем нашей системы


## get_auth_token
Для авторизации через стим необходимо получить специальный токен
#### way
    ["api", "user", "get_auth_token"]
#### request
    {}
#### response
    auth_token: String
#### examle
```javascript
var id = dispatcher.add(function (_e) {
    dispatcher.remove(id);
    console.log(_e.auth_token);
});
dispatcher.send(id, ["api", "user", "get_auth_token"]);
```




## auth
Необходимо выполнить авторизацию через стим
#### Пример:
```javascript
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
#### example
```javascript
var id = dispatcher.add(function (_data) {
    sessionStorage.setItem("requestToken", _data.request_token);
    location.href = location.href.split("?")[0];
});
dispatcher.send(id, ["api", "user", "auth"], {
    options: {...},
    auth_token: auth_token
})
```



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
#### example
```javascript
var id = dispatcher.add(function (_e) {
    if(_e.success) {
        dispatcher.remove(rid);
        console.log("now you are logged and get account info")
    } else {
        sessionStorage.clear();
        location.href = "";
    }
}.bind(this));

dispatcher.send(rid, ["api", "user", "get_user_info"], {
    request_token: sessionStorage.getItem("requestToken")
});
```

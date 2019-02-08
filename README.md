# nsb

## Упрощенное API.
```javascript
<script src="http://li1477-188.members.linode.com/dispatcher.dev.js"></script>
<script>

WB_API.on("ready", function() {
    // Теперь можно отправлять запросы на сервер.
    console.log("ready");
})
</script>
```
Методы доступные через объект WB_API:
```javascript

    // Запрос на уникальный токен, который необходим для авторизации в нашей системе
    // Результат запроса будет содержать auth_token
    WB_API.users.get_auth_token(_callback)

    // Запрос на авторизацию в нашей системе
    // _auth_token - уникальный токен, который был выдан ранее
    // _options - параметры GET запроса, которые пришли при редиректе с страницы авторизации в стиме
    // Результат будет содержать request_token, он необходим для некоторых запросов
    WB_API.users.auth(_auth_token, _options, _callback)

    // Запрос информации о пользователе
    // _request_token - идентификатор защищенного запроса
    WB_API.users.get_user_info(_request_token, _callback)

    // Запрос на список существующих кейсов
    // Результатом будет список кейсов и их информация
    WB_API.inventory.get_cases(_callback)

    // Запрос на список содержимого кейса.
    // _case_id - идентификатор кейса
    WB_API.inventory.get_case_content(_case_id, _callback)

    // Переведет на страницу авторизации через стим
    // _auth_token - токен, который потребуется для подтверждения валидации авторизации. Для его получения нужно использовать
    // WB_API.users.get_auth_token
    // _return_url - адрес страницы, на которую должен будет придти ответ с GET параметрами от стима
    // _host - Адрес сайта, на который будет совершен редирект.
    WB_API.redirect_to_steam_auth(_auth_token, ?_return_url, ?_host)
```

# API
- [User](#User)
    - [get_auth_token](#get_auth_token)
    - [auth](#auth)
    - [get_user_info](#get_user_info)
- [Inventory](#Inventory)
    - [get_cases](#get_cases)
    - [get_case_content](#get_case_content)

# Самостоятельная нициализация диспетчера

# Подключится к серверу:
1) Нужно скачать эту библиотеку - [Dispatcher](https://github.com/DanSylvest/nsb/blob/csgo/client/js/libs/dispatcher.dev.js);
2) Библиотека предназначена для подключения к нашему серверу.

#### Пример
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


## Inventory
Область запросов к нашей системе, для работы с кейсами

## get_cases
Возвращает список кейсов с информацией по ним

#### way
    ["api", "inventory", "get_cases"]
#### request
    {}
#### response
    {
        success: Boolean,
        cases: Array(
            {
                case_id: Number,
                image: String,
                name: String,
                description: String,
                old_price: Number,
                new_price: Number
            },
            ...
        )
    }
#### example
```javascript
var id = dispatcher.add(function (_event) {
    // Распечатаем ответ
    _event.success && console.log(JSON.stringify(_event.cases, true, 3))
}.bind(this));
dispatcher.send(rid, ["api", "inventory", "get_cases"]);
```

## get_case_content
Возвращает список предметов для кейса с их информацией.

#### way
    ["api", "inventory", "get_case_content"]
#### request
    {}
#### response
    // Пример ответа
    {
        success: Boolean,
        cases_content: Array(
            {
                "our_market_instanceid":null,
                "market_name":"G3SG1 | Витраж (Прямо с завода)",
                "name":"G3SG1 | Витраж",
                "market_hash_name":"G3SG1 | Demeter (Factory New)",
                "rarity":"Армейское качество",
                "quality":"Прямо с завода",
                "type":"Снайперская винтовка",
                "mtype":"CSGO_Type_SniperRifl",
                "slot":"Обыч.",
                "image":"https://cdn.csgo.com//item/G3SG1+%7C+%D0%92%D0%B8%D1%82%D1%80%D0%B0%D0%B6+%28%D0%9F%D1%80%D1%8F%D0%BC%D0%BE+%D1%81+%D0%B7%D0%B0%D0%B2%D0%BE%D0%B4%D0%B0%29/150.png",
                "description":[  ],
                "tags":[  ],
                "hash":"4be786633546c0f9e30817b1cae4415d"
            },
            ...
        )
    }
#### example
```javascript
var id = dispatcher.add(function (_event) {
    // Распечатаем ответ
    _event.success && console.log(JSON.stringify(_event.cases_content, true, 3))
}.bind(this));
dispatcher.send(rid, ["api", "inventory", "get_case_content"], {
    case_id: 0 // или любой другой идентификатор
});
```
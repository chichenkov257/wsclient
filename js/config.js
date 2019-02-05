(function () {
    var _mpath = "js/config";

    define(_mpath, [], function () {
        var config = {
            product: {
                version: 0, // will not update untill pre beta state
                state: "pre beta",
                name: "mapper"
            },
            connection: {
                socket: {
                    host: "127.0.0.1",
                    proto: "ws",
                    port: "1400"
                }
            },
            sso_client: {
                response_type: "code",
                client_id: "", // application Client Id,
                scope: [
                    "esi-location.read_location.v1",
                    "esi-location.read_ship_type.v1",
                    "esi-location.read_online.v1"
                ]
            },
            eve_sso_server:  {
                host: "login.eveonline.com", // login server
                proto: "https:", // protocol
                content_type: "application/x-www-form-urlencoded"
            }
        };

        return config;
    });
})();

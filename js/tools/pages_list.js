(function (_export) {
    var name = "js/tools/pages_list";
    var libs = [
        // list of pages that not requested token
        "js/ui/pages/public/main",
        "js/ui/pages/public/winbox",
        // "js/client/pages/public/auth",
        // "js/client/pages/public/reg",

        // list of pages that need authorization
        // "js/client/pages/protected/ccp_auth_page",
        // "js/client/pages/protected/ccp_auth_response",
        // "js/client/pages/protected/chars_list",
        // "js/client/pages/protected/maps_list",
        // "js/client/pages/protected/add_map",
        // "js/client/pages/protected/common_page",
        // "js/client/pages/protected/map"
    ];
    define(name, libs, function () {
        var obj = {};
        var a = 0;
        while( a < libs.length){
            var path = libs[a];
            var arr_path = path.split("/");
            var last_hop = arr_path[arr_path.length - 1];
            obj[last_hop] = require(path);
            a++;
        }
        return obj;
    })
})(window);
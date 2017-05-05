/**
 * Created by root on 28/04/17.
 */

function apisCtrlAnalytics($scope, $routeParams, $http) {
    var id = $routeParams.id;
    var constant = localStorage.baseURL+"constants.json";

    // timestamp date
    var now = new Date();
    var year   = now.getFullYear();
    var month    = ('0'+(now.getMonth()+1));
    var day    = ('0'+now.getDate()   ).slice(-2);
    var hour   = ('0'+now.getHours()  ).slice(-2);
    var min  = ('0'+now.getMinutes()).slice(-2);
    var second = ('0'+now.getSeconds()).slice(-2);
    var date_1 = ((day-1)+'/'+month+'/'+year+' '+hour+':'+min+':'+second);
    var date = (day+'/'+month+'/'+year+' '+hour+':'+min+':'+second);

    // this is a test
    // console.log('test');

    /* Application - default */
    $scope.showTopApplication = 'true';
    $scope.showTopPlan = 'true';
    $scope.showSlowApplications = 'true';

    httpSuccessAPIAnalytics = function (response) { $scope.rep = response; }
    httpSuccessAPIAnalyticsApplications = function (response) {

        //console.log(typeof (response.value) === 'undefined');
        if(typeof (response.value) === 'undefined')
            $scope.showTopApplication = 'false';
        else {
            $scope.application = response;
            $scope.showTopApplication = 'true';
        }
    }
    httpSuccessAPIAnalyticsStatus = function (response) { $scope.status = response; }
    httpSuccessAPIAnalyticsPlan = function (response) {

        if(typeof (response.value) === 'undefined')
            $scope.showTopPlan = 'false';
        else {
            $scope.plan = response;
            $scope.showTopPlan = 'true';
        }
    }
    httpSuccessAPIAnalyticsSlowApplications = function (response) {

        if(typeof (response.value) === 'undefined')
            $scope.showSlowApplications = 'false';
        else {
            $scope.slowApplications = response;
            $scope.showSlowApplications = 'true';
        }
    }

    function toTimestamp(strDate){
        var datum = Date.parse(strDate);
        return datum/1000;
    }

    $http.get(constant).success(function (response) {

        var api = response["baseURL"]+"apis/"+id+"/"; // with login
        var applications = response["baseURL"] + "apis/" + id +
            "/analytics?type=group_by&field=application&size=20&interval=600000&from="+toTimestamp(date_1)+"908&to="+toTimestamp(date)+"908&";
        var status = response["baseURL"] +
            "apis/" + id + "/analytics?type=group_by&field=status&ranges=100:199;200:299;300:399;400:499;500:599&interval=600000&from="+toTimestamp(date_1)+"478&to="+toTimestamp(date)+"478&";
        var topPlan = response["baseURL"] +
            "apis/" + id + "/analytics?type=group_by&field=plan&size=20&interval=600000&from="+toTimestamp(date_1)+"607&to="+toTimestamp(date)+"607&";
        var topSlowApplications = response["baseURL"] + "apis/" + id +
            "/analytics?type=group_by&field=application&order=-avg:response-time&size=20&interval=43200000&from="+toTimestamp(date_1)+"780&to="+toTimestamp(date)+"780&";

        /* General */
        $http.get(api,{
            headers: {'Authorization': 'Basic ' + encode(localStorage.username+':'+localStorage.password)}
        }).success(httpSuccessAPIAnalytics).error(function () {
            document.location.href="index.html";
        });

        /* Top applications */
        $http.get(applications,{
            headers: {'Authorization': 'Basic ' + encode(localStorage.username+':'+localStorage.password)}
        }).success(httpSuccessAPIAnalyticsApplications).error(function () {
           document.location.href="index.html";
        });

        /* Status */
        $http.get(status,{
            headers: {'Authorization': 'Basic ' + encode(localStorage.username+':'+localStorage.password)}
        }).success(httpSuccessAPIAnalyticsStatus).error(function () {
            document.location.href="index.html";
        });

        /* Top plan */
        $http.get(topPlan,{
            headers: {'Authorization': 'Basic ' + encode(localStorage.username+':'+localStorage.password)}
        }).success(httpSuccessAPIAnalyticsPlan).error(function () {
            document.location.href="index.html";
        });

        /* Top slow applications */
        $http.get(topSlowApplications,{
            headers: {'Authorization': 'Basic ' + encode(localStorage.username+':'+localStorage.password)}
        }).success(httpSuccessAPIAnalyticsSlowApplications).error(function () {
            document.location.href="index.html";
        });

    });


    $scope.changeAPIsAnalytics = function () {

        document.getElementById('boxTopApp').setAttribute('style','display: none');
        document.getElementById('boxStatus').setAttribute('style','display: none');
        document.getElementById('boxTopPlan').setAttribute('style','display: none');
        document.getElementById('boxTopSlowApp').setAttribute('style','display: none');
        document.getElementById('boxResponseStatus').setAttribute('style','display: none');
        document.getElementById('boxResponseTimes').setAttribute('style','display: none');
        document.getElementById('boxHitsByApp').setAttribute('style','display: none');

        var selectElmt = document.getElementById('select_tabAPIs');
        var value = selectElmt.options[selectElmt.selectedIndex].value;

        if(value === "topApplications")     { document.getElementById('boxTopApp').setAttribute('style','display: inline'); }
        if(value === "status")              { document.getElementById('boxStatus').setAttribute('style','display: inline'); }
        if(value === "topPlan")             { document.getElementById('boxTopPlan').setAttribute('style','display: inline'); }
        if(value === "topSlowApplications") { document.getElementById('boxTopSlowApp').setAttribute('style','display: inline'); }
        if(value === "responseStatus")      { document.getElementById('boxResponseStatus').setAttribute('style','display: inline'); }
        if(value === "responseTimes")       { document.getElementById('boxResponseTimes').setAttribute('style','display: inline'); }
        if(value === "hitsByApplication")   { document.getElementById('boxHitsByApp').setAttribute('style','display: inline'); }

    }

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function encode(input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                keyStr.charAt(enc1) +
                keyStr.charAt(enc2) +
                keyStr.charAt(enc3) +
                keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }
}
#!/usr/bin/env node

var superagent = require('superagent');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = require('request');
var Agent = require('agentkeepalive');

function getop1(s) {
    var i = 0;
    var res = '';

    var s = s.split("U<sub>n+1</sub> = [ ")[1];
    while (' ' != s[i]) {
        res += s[i];
        ++i;
    } return res;
}

function getop2(s) {
    var i = 0;
    var res = '';

    var s = s.split("U<sub>n+1</sub> = [ ")[1];
    s = s.split('* ')[1]
    while (' ' != s[i]) {
        res += s[i];
        ++i;
    } return res;
}

function getu0(s) {
    var i = 0;
    var res = '';

    var s = s.split("U<sub>0</sub> = ")[1];
    while ('\n' != s[i]) {
        res += s[i];
        ++i;
    } return res;
}

function getlimit(s) {
    var i = 0;
    var res = '';

    var s = s.split("You must find U<sub>")[1];
    while ('<' != s[i]) {
        res += s[i];
        ++i;
    } return res;
}

function getsign(s) {
    return s.split("+ U<sub>n</sub> ] ")[1][0];
}

function calculate(u0, op1, op2, limit, sign) {
    var i = 0;
    var un = u0;
    var unp1 = 0;

    while (i < limit) {
        if ('+' == sign) unp1 = (op1 + un) + (i * op2);
        else unp1 = (op1 + un) - (i * op2);
        ++i;
    } return unp1;
}

async function fetch() {
    try {
        var keepaliveAgent = new Agent({
            maxSockets: 100,
            maxFreeSockets: 10,
            timeout: 60000,
            keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
        });

        superagent.agent = keepaliveAgent;
        const response = await superagent.get('http://challenge01.root-me.org/programmation/ch1/')
        var html = response.text;



        // var cookies = "vary: 'Accept-Encoding', 'set-cookie':'[ " + response.headers['set-cookie'] + " ]"
        // cookies = response.headers['set-cookie']
        // var cookies = response.header.vary
        // console.log(response);
        // cookies = JSON.stringify(cookies)
        // console.log(cookies)

        var url;

        var u0 = parseInt(getu0(html));
        var op1 = parseInt(getop1(html));
        var op2 = parseInt(getop2(html));
        var sign = getsign(html);
        var limit = parseInt(getlimit(html));
        var res = parseInt(calculate(u0, op1, op2, limit, sign));

        // console.log(u0 + ":" + op1 + ":" + op2 + ":" + limit + ":" + sign);
        // console.log(calculate(5, 10, -10, 3, '+'))

        res = calculate(u0, op1, op2, limit, sign)
        // url = 'http://challenge01.root-me.org/programmation/ch1'
        // var path = '/ep1_v.php?result=' + res
        url = 'http://challenge01.root-me.org/programmation/ch1/ep1_v.php?result=' + res;
        // console.log(url)

        request({
            url: url,
            // path: path,
            method: "GET",
            header: { 
                // 'set-cookie': cookies
            }
        }, function (err, response) {
            console.log(response.headers) // one of the headers says user is not authorised
        })


        function reqListener() {
            console.log(this.responseText);
        }

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("get", url, false);
        oReq.send();

    } catch (error) {
        console.log('error :  ' + error);
    }
}

fetch();
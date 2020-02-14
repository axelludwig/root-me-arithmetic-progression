#!/usr/bin/env node

const superagent = require('superagent');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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
    var unp1;

    while (i < limit) {
        if ('+' == sign) unp1 = (op1 + un) + (i * op2);
        else unp1 = (op1 + un) - (i * op2);
        ++i;
    } return unp1;
}

async function fetch() {
    try {
        const response = await superagent.get('http://challenge01.root-me.org/programmation/ch1/')
        var html = response.text;
        // console.log(html);

        var url;

        var u0 = getu0(html);
        var op1 = getop1(html);
        var op2 = getop2(html);
        var sign = getsign(html);
        var limit = getlimit(html);
        var res = calculate(u0, op1, op2, limit, sign);

        // console.log(u0 + ":" + op1 + ":" + op2 + ":" + limit + ":" + sign);
        // console.log(calculate(5, 10, -10, 3, '+'))

        res = calculate(u0, op1, op2, limit, sign)
        url = 'http://challenge01.root-me.org/programmation/ch1/ep1_v.php?result=' + res
        console.log(res)

        function reqListener () {
            console.log(this.responseText);
          }
          
          var oReq = new XMLHttpRequest();
          oReq.onload = reqListener;
          oReq.open("get", url, true);
          oReq.send();

    } catch (error) {
        console.log(error);
    }
}


fetch();
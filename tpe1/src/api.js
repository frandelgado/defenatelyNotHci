import React from 'react';
import * as $ from "jquery";


var api = class {
    static get baseUrl(){
        return "http://127.0.0.1:8080/api/";
    }

    static get timeout() {
        return 60 * 1000;
    }
};
api.room = class{
    static get url(){
        return api.baseUrl + "rooms/"
    }

    static add(room) {
        return $.ajax({
            url: api.room.url,
            method: "POST",
            dataType: "json",
            timeout: api.timeout,
            data: room
        });
    }

    static modify(room) {
        return $.ajax({
            url: api.room.url + room.id,
            method: "PUT",
            dataType: "json",
            timeout: api.timeout,
            data: room
        });
    }

    static delete(id) {
        return $.ajax({
            url: api.room.url + id,
            method: "DELETE",
            dataType: "json",
            timeout: api.timeout,
            // data: room
        });
    }

    static get(id) {
        return $.ajax({
            url: api.room.url + id,
            method: "GET",
            dataType: "json",
            timeout: api.timeout
        });
    }
    static getDevices(id) {
        return $.ajax({
            url: api.room.url + id + "/Devices",
            method: "GET",
            dataType: "json",
            timeout: api.timeout
        })
    }
};
api.routine = class{
    static get url(){
        return api.baseUrl + "routines/"
    }

    static list() {
        return $.ajax({
            url: api.routine.url,
            method: "GET",
            dataType: "json",
            timeout: api.timeout
        });
    }

    static add(routine) {
        return $.ajax({
            url: api.routine.url,
            method: "POST",
            dataType: "json",
            timeout: api.timeout,
            data: routine
        });
    }

    static modify(routine) {
        return $.ajax({
            url: api.routine.url + routine.id,
            method: "PUT",
            dataType: "json",
            timeout: api.timeout,
            data: routine
        });
    }

    static delete(id) {
        return $.ajax({
            url: api.routine.url + id,
            method: "DELETE",
            dataType: "json",
            timeout: api.timeout
        });
    }

    static get(id) {
        return $.ajax({
            url: api.routine.url + id,
            method: "GET",
            dataType: "json",
            timeout: api.timeout
        });
    }

    static execute(id) {
        return $.ajax({
            url: api.routine.url + id + '/execute',
            method: "PUT",
            dataType: "json",
            timeout: api.timeout,
            data: {}
        });
    }
};
export default api;


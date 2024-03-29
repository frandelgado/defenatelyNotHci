package com.falopa.smarthome.model;


import com.falopa.smarthome.utils.Callback;

import java.util.ArrayList;

public class Room {
    private String id;
    private String name;
    private transient ArrayList<Device> devices;
    private transient ArrayList<Routine> routines;

    private Room(){}

    private Room(String id, String name){
        this.id = id;
        this.name = name;
    }

    public static void create(String name, Callback callback) {
        //request
    }

    public void update(Callback callback) {
        //request
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Device> getDevices() {
        return devices;
    }

    public ArrayList<Routine> getRoutines() {
        return routines;
    }

    public boolean addDevice(Device device) {
        return devices.add(device);
    }

    public boolean removeDevice(Device device) {
        return devices.remove(device);
    }

    public boolean addRoutine(Routine routine) {
        return routines.add(routine);
    }

    public boolean removeRoutine(Routine routine) {
        return routines.remove(routine);
    }
}

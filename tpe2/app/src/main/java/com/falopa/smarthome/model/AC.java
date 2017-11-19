package com.falopa.smarthome.model;


public class AC extends Device {
    private boolean status;
    private Integer temperature;
    private String mode;
    private String verticalSwing;
    private String horizontalSwing;
    private String fanSpeed;

    public AC(String id, String name, DeviceType type, String roomId) {
        super(id, name, type, roomId);
    }

    public static AC create(String name, DeviceType type, String roomId) {
        String id = Device.createDevice(name, type, roomId);
        if (id != null) {
            return new AC(id, name, type, roomId);
        }
        return null;
    }

    public boolean getStatus() {
        return status;
    }

    @Override
    public boolean update() {
        //request
        return false;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public Integer getTemperature() {
        return temperature;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public String getVerticalSwing() {
        return verticalSwing;
    }

    public void setVerticalSwing(String verticalSwing) {
        this.verticalSwing = verticalSwing;
    }

    public String getHorizontalSwing() {
        return horizontalSwing;
    }

    public void setHorizontalSwing(String horizontalSwing) {
        this.horizontalSwing = horizontalSwing;
    }

    public String getFanSpeed() {
        return fanSpeed;
    }

    public void setFanSpeed(String fanSpeed) {
        this.fanSpeed = fanSpeed;
    }
}

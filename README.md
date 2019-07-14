# Node REST api to control an IKEA Trådfri setup

Control all the things! Add your own functionality if IKEA haven't made the feature you need.  
It is able to control all lights and plugs no matter which room or scene.


Heavily inspiret by: https://github.com/wschenk/tradfri-cli  
and the article from the same author: https://willschenk.com/articles/2019/controlling_ikea_tradfri_with_node/  
Thanks alot, couldn't have done it without that!

## Api endpoints (default port is 3500):
<!-- 1.  `THE_IP:3500/rooms` - Get all rooms.
2.  `THE_IP:3500/rooms/get-single-room` - Get a single room. Takes a JSON object as request body.
3.  `THE_IP:3500/rooms/set-room` - Set a scene in a room. -->

Endpoint                    | Request object              | Description      
----------------            | --------------------------- | ---------------- 
/rooms                      | none                        | Get all rooms info
/rooms/get-single-room      | room-request                | Get a single room info
/rooms/set-room             | room-request                | Set a scene in a room
/devices                    | none                        | Get all devices paired with the bridge
/devices/get-single-device  | device-request              | Get a single device
/devices/set-device         | device-request              | Control color, brightness and on/off state
/masterswitch               | confirmation-request        | Turns off everything
/masterswitch/all-on        | confirmation-request        | Turns on everything

----------------------------

## Request types:
Depending on the operation, the api takes different JSON request objects

### room-request
Used to get information of the room and control the scenes in the room

#### Example
```json
  {
    "room": {
      "name": "Living Room",
      "scene": "Relax"
    }
  }
```
`"name"` - The name of the room
`"scene"` - The scene to set

### device-request
Used to get information of a device and control the device

#### Example
```json
{
  "deviceNameOrId": "65537",
  "action": {
    "name": "brightness",
    "value": "37"
  }
}
```  
`"deviceNameOrId"` - Pass either the name or the id of the device  
`"name"` - Name of the commmand you want, can be one of: `"on" | "off" | "toggle" | "brightness" | "color"`  
`"value"` - The value of the action. e.g. for brightness pass a value betweeen `0-100` and for colors it could be `"f1e0b5"`

### confirmation-request 
Used to confirm the masterswitch. It is there to prevent someone to just accessing the URL

#### Example
```json
{
	"confirmation": true
}
```
`"confirmation"` - Should always be true

## .env variables needed:
1.  `BRIDGE_KEY` - The security key on the back of the bridge.
2.  `SERVER_PORT` - The port the server should run on.

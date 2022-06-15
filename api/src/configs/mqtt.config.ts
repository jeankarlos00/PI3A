
import mqtt, { MqttClient } from "mqtt";
import validateEnv from "../utils/validateEnv";

const client = mqtt.connect({
    host: validateEnv.MQTT_HOST,
    port: validateEnv.MQTT_PORT,
    protocol: "mqtts",
    username: validateEnv.MQTT_USER,
    password: validateEnv.MQTT_PASS,
});

export default client;
 
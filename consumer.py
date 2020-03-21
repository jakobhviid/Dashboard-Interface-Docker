import json
from kafka import KafkaConsumer


def create_consumer():
     # kafka_urls = os.environ.get("KAFKA_URLS")
    kafka_urls = 'kafka2.cfei.dk:9093'
    # kafka_topic = os.environ.get("KAFKA_TOPIC")
    kafka_topic = 'test'
    return KafkaConsumer(kafka_topic, bootstrap_servers=kafka_urls,
     value_deserializer=lambda m: json.loads(m.decode('ascii')))

consumer = create_consumer()

for message in consumer:
    print(message)



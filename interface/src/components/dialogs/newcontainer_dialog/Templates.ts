export interface IVolume {
  hostPath: string;
  containerPath: string;
}

export interface IPort {
  containerPort: string;
  hostPort: string;
}

export interface IEnvironment {
  key: string;
  value: string;
}

export interface INewContainerValues {
  image: string;
  name: string;
  command: string;
  ports: IPort[];
  environment: IEnvironment[];
  restartPolicy: {
    restartPolicy: string;
    maximumRetryCount: string;
  };
  volumes: IVolume[];
  volumesFrom: string[];
  networkMode: string;
}

export interface IContainerValuesToSend {
  image: string;
  name: string;
  command: string;
  ports: IPort[];
  environment: string[];
  restartPolicy?: {
    restartPolicy: string;
    maximumRetryCount: string;
  };
  volumes: IVolume[];
  volumesFrom: string[];
  networkMode: string;
}

export interface ITemplate {
  [templateName: string]: INewContainerValues;
}

export const templates: ITemplate = {
  Kafka: {
    image: "cfei/kafka:2.0.0-beta",
    name: "kafka",
    command: "",
    ports: [
      { containerPort: "9092", hostPort: "9092" },
      { containerPort: "9093", hostPort: "9093" },
    ],
    environment: [
      { key: "KAFKA_BROKER_ID", value: "1" },
      { key: "KAFKA_ZOOKEEPER_CONNECT", value: "127.0.0.1:2181" },
      { key: "KAFKA_LISTENERS", value: "INTERNAL_SASL_PLAINTEXT://0.0.0.0:9092,SASL_PLAINTEXT://0.0.0.0:9093" },
      { key: "KAFKA_ADVERTISED_LISTENERS", value: "INTERNAL_SASL_PLAINTEXT://localhost:9092,SASL_PLAINTEXT://localhost:9093" },
      { key: "KAFKA_INTER_BROKER_LISTENER_NAME", value: "INTERNAL_SASL_PLAINTEXT" },
      { key: "KAFKA_AUTHENTICATION", value: "KERBEROS" },
      { key: "KERBEROS_PUBLIC_URL", value: "127.0.0.1" },
      { key: "KERBEROS_REALM", value: "CFEI.SECURE" },
      { key: "KERBEROS_API_URL", value: "http://127.0.0.1:3000/get-keytab" },
      { key: "KERBEROS_API_KAFKA_USERNAME", value: "kafka/localhost" },
      { key: "KERBEROS_API_KAFKA_PASSWORD", value: "kafkaPasswordTester" },
      { key: "KERBEROS_API_ZOOKEEPER_USERNAME", value: "zookeeper/localhost" },
      { key: "KERBEROS_API_ZOOKEEPER_PASSWORD", value: "zookeeperPasswordTester" },
      { key: "KAFKA_HEAP_OPTS", value: "-Xmx4G" },
      { key: "KAFKA_ACL_ENABLE", value: "true" },
      { key: "KAFKA_ACL_SUPER_USERS", value: "User:kafka;User:admin" },
      { key: "KAFKA_ZOOKEEPER_SET_ACL", value: "true" },
    ],
    restartPolicy: {
      restartPolicy: "none",
      maximumRetryCount: "",
    },
    volumes: [],
    volumesFrom: [],
    networkMode: "",
  },
  Zookeeper: {
    image: "cfei/zookeeper:2.0.0-beta",
    name: "zookeeper",
    command: "",
    ports: [
      { containerPort: "2181", hostPort: "2181" },
      { containerPort: "2888", hostPort: "2888" },
      { containerPort: "3888", hostPort: "3888" },
    ],
    environment: [
      { key: "ZOO_ID", value: "1" },
      { key: "ZOO_PORT", value: "2181" },
      { key: "ZOO_AUTHENTICATION", value: "KERBEROS" },
      { key: "ZOO_KERBEROS_PUBLIC_URL", value: "127.0.0.1" },
      { key: "ZOO_KERBEROS_REALM", value: "CFEI.SECURE" },
      { key: "ZOO_KERBEROS_API_URL", value: "http://127.0.0.1:3000/get-keytab" },
      { key: "ZOO_KERBEROS_API_USERNAME", value: "zookeeper/localhost" },
      { key: "ZOO_KERBEROS_API_PASSWORD", value: "zookeeperPasswordTester" },
      { key: "ZOO_REMOVE_HOST_AND_REALM", value: "true" },
      { key: "ZOO_SERVERS", value: "server.1=0.0.0.0:2888:3888,server.2=REPLACE:2888:3888,server.3=REPLACE:2888:3888"},
    ],
    restartPolicy: {
      restartPolicy: "onFailure",
      maximumRetryCount: "3",
    },
    volumes: [],
    volumesFrom: [],
    networkMode: "",
  },
  Kerberos: {
    image: "cfei/kerberos",
    name: "kerberos",
    command: "",
    ports: [
      { containerPort: "3000", hostPort: "3000" },
    ],
    networkMode: "host",
    restartPolicy: {
      restartPolicy: "onFailure",
      maximumRetryCount: "3",
    },
    environment: [
      { key: "KERBEROS_ADMIN_PW", value: "password" },
      { key: "KERBEROS_HOST_DNS", value: "127.0.0.1" },
      { key: "KERBEROS_REALM", value: "CFEI.SECURE" },
      { key: "KERBEROS_API_PORT", value: "3000" },
      { key: "KERBEROS_MSSQL_CONNECTION_STRING", value: "Server=<<mssql_ip_address>>;Database=<<database_name>;User Id=<<database_user>>;Password=<<database_password>>;" },
    ],
    volumes: [],
    volumesFrom: [],
  }
};

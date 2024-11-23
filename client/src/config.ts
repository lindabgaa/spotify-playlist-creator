const ENV = import.meta.env.VITE_ENV || "development";
const validEnvironments = ["development", "production", "test"];
const isValidEnv = validEnvironments.includes(ENV);
const finalEnv = isValidEnv ? ENV : "development";

const CONFIG = {
  ENV,
  SERVER_URL: import.meta.env[`VITE_${finalEnv.toUpperCase()}_SERVER_URL`],
};

export default CONFIG;

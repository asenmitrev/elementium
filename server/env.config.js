module.exports = {
  apps: [
    {
      name: "elementium",
      script: "./index.js",
      exec_interpreter: "/home/admin/.nvm/versions/node/v20.15.1/bin/node",
      append_env_to_name: true,
      wait_ready: true,
      watch: false,
      treekill: false,
      ignore_watch: ["node_modules", "data"],
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

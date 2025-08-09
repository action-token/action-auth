/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aws-hono",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      version: "3.17.10",
    };
  },
  async run() {
    const BETTER_AUTH_SECRET = "vongcong";
    const BETTER_AUTH_URL =
      "https://6pmchmr7hbk3pa67v65zanflre0kaiyo.lambda-url.us-west-2.on.aws"; // Base URL of your app
    const GOOGLE_CLIENT_ID =
      "284987126985-sk1uias85aanh89hrvh1e8ljp2hpd9b9.apps.googleusercontent.com";

    // const bucket = new sst.aws.Bucket("MyBucket");
    const dbUrl = new sst.Secret("TURSO_DATABASE_URL");
    const authToken = new sst.Secret("TURSO_AUTH_TOKEN");
    const googleClientSecret = new sst.Secret("GOOGLE_CLIENT_SECRET");

    new sst.aws.Function("Hono", {
      url: {
        cors: {
          allowCredentials: true,
          allowOrigins: ["http://localhost:5173", "http://localhost:3000"],
          allowHeaders: ["content-type", "authorization"],
          allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"],
          maxAge: "1 day",
        },
      },
      link: [dbUrl, authToken],
      handler: "src/index.handler",
      environment: {
        BETTER_AUTH_SECRET,
        BETTER_AUTH_URL,
        TURSO_DATABASE_URL: dbUrl.value,
        TURSO_AUTH_TOKEN: authToken.value,
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: googleClientSecret.value,
      },
    });
  },
});

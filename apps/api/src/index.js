import { createServer } from "node:http";
import { resolve } from "node:path";
import { config as loadEnv } from "dotenv";
loadEnv({ path: resolve(__dirname, "../../.env"), override: true });
loadEnv();
import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
async function bootstrap() {
    const app = createApp();
    const server = createServer(app);
    const port = env.PORT;
    server.listen(port, () => {
        console.log(`API listening on http://localhost:${port}`);
    });
    const shutdown = async (signal) => {
        console.log(`Received ${signal}. Gracefully shutting down.`);
        server.close(async (error) => {
            if (error) {
                console.error("Error closing server", error);
                process.exit(1);
            }
            await prisma.$disconnect();
            process.exit(0);
        });
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}
bootstrap().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});

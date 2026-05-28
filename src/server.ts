import { server } from "@/app";
import { env } from "@/env";

server.listen(env.PORT, () => {
  console.log(`Servidor HTTP e WebSocket rodando na porta ${env.PORT}`);
});

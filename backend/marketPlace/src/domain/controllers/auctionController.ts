import { CreateAuction } from "../../application/usecases/createAuction";
import { PlaceBid } from "../../application/usecases/placeBid";
import { GetAuctions } from "../../application/usecases/getAuctions";
import { EndAuction } from "../../application/usecases/endAuction";
import { HttpServer } from "../../infra/http/httpserver";

export class AuctionController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createAuction: CreateAuction,
    readonly placeBid: PlaceBid,
    readonly getAuctions: GetAuctions,
    readonly endAuction: EndAuction
  ) {
    // Criar leilão
    this.httpServer.register("post", "/marketplace/createAuction", async (body: any, params: any) => {
      const output = await createAuction.execute(body);
      return output;
    });

    // Fazer lance
    this.httpServer.register("post", "/marketplace/placeBid", async (body: any, params: any) => {
      const output = await placeBid.execute(body);
      return output;
    });

    // Listar leilões
    this.httpServer.register("get", "/marketplace/getAuctions", async (body: any, params: any) => {
      const output = await getAuctions.execute();
      return output;
    });

    // Buscar leilão por ID
    this.httpServer.register("get", "/marketplace/getAuction/:auction_id", async (body: any, params: any) => {
      const output = await getAuctions.execute();
      return output;
    });

    // Finalizar leilão
    this.httpServer.register("put", "/marketplace/endAuction", async (body: any, params: any) => {
      const output = await endAuction.execute(body.auction_id);
      return output;
    });

    // Buscar leilões ativos
    this.httpServer.register("get", "/marketplace/getActiveAuctions", async (body: any, params: any) => {
      const output = await getAuctions.execute();
      return output;
    });

    // Buscar leilões por vendedor
    this.httpServer.register("get", "/marketplace/getAuctionsBySeller", async (body: any, params: any) => {
      const output = await getAuctions.execute();
      return output;
    });
  }
}

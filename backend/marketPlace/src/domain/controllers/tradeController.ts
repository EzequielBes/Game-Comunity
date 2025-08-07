import { HttpServer } from '../../infra/http/httpserver';
import { CreateTradeProposal } from '../../application/usecases/createTradeProposal';
import { GetUserTrades } from '../../application/usecases/getUserTrades';
import { UpdateTradeStatus } from '../../application/usecases/updateTradeStatus';

export class TradeController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createTradeProposal: CreateTradeProposal,
    readonly getUserTrades: GetUserTrades,
    readonly updateTradeStatus: UpdateTradeStatus
  ) {
    this.httpServer.register("post", "/marketplace/createTrade", async (body: any, params: any) => {
      const output = await createTradeProposal.execute(body);
      return output;
    });

    this.httpServer.register("get", "/marketplace/getUserTrades", async (body: any, params: any) => {
      const output = await getUserTrades.execute(params.userId);
      return output;
    });

    this.httpServer.register("put", "/marketplace/updateTradeStatus", async (body: any, params: any) => {
      const output = await updateTradeStatus.execute({
        tradeId: body.tradeId,
        userId: body.userId,
        status: body.status
      });
      return output;
    });

    this.httpServer.register("delete", "/marketplace/cancelTrade", async (body: any, params: any) => {
      const output = await updateTradeStatus.execute({
        tradeId: body.trade_id,
        userId: body.user_id,
        status: 'cancelled'
      });
      return output;
    });
  }
}

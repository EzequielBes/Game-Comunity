import * as dotenv from "dotenv";
import { CreatePost } from "./application/create_post_usecase";
import { GetPosts } from "./application/get_posts_usecase";
import { UpdatePost } from "./application/update_post_usecase";
import { DeletePost } from "./application/delete_post_usecase";
import { GetPostById } from "./application/get_post_by_id_usecase";
import { CreateTradeProposal } from "./application/usecases/createTradeProposal";
import { GetUserTrades } from "./application/usecases/getUserTrades";
import { UpdateTradeStatus } from "./application/usecases/updateTradeStatus";
import { CreateAuction } from "./application/usecases/createAuction";
import { PlaceBid } from "./application/usecases/placeBid";
import { GetAuctions } from "./application/usecases/getAuctions";
import { EndAuction } from "./application/usecases/endAuction";
import { PostController } from "./domain/controllers/postController";
import { TradeController } from "./domain/controllers/tradeController";
import { AuctionController } from "./domain/controllers/auctionController";
import { PostgresDatabase } from "./infra/database/databaseConnection/database";
import { PostRepositoryDatabase } from "./infra/database/repository/postRepository";
import { TradeRepositoryDatabase } from "./infra/database/repository/tradeRepository";
import { AuctionRepositoryDatabase } from "./infra/database/repository/auctionRepository";
import { BidRepositoryDatabase } from "./infra/database/repository/bidRepository";
import { ExpressHttpServer } from "./infra/http/httpserver";

dotenv.config();

const connectionDatabase = new PostgresDatabase();
const postRepository = new PostRepositoryDatabase(connectionDatabase);
const tradeRepository = new TradeRepositoryDatabase(connectionDatabase);
const auctionRepository = new AuctionRepositoryDatabase(connectionDatabase);
const bidRepository = new BidRepositoryDatabase(connectionDatabase);
const server = new ExpressHttpServer();

const createPost = new CreatePost(postRepository);
const getPosts = new GetPosts(postRepository);
const updatePost = new UpdatePost(postRepository);
const deletePost = new DeletePost(postRepository);
const getPostByIdUseCase = new GetPostById(postRepository);

const createTradeProposal = new CreateTradeProposal(tradeRepository);
const getUserTrades = new GetUserTrades(tradeRepository);
const updateTradeStatus = new UpdateTradeStatus(tradeRepository);

const createAuction = new CreateAuction(auctionRepository);
const placeBid = new PlaceBid(auctionRepository, bidRepository);
const getAuctions = new GetAuctions(auctionRepository);
const endAuction = new EndAuction(auctionRepository);

new PostController(server, createPost, getPosts, updatePost, deletePost, getPostByIdUseCase);
new TradeController(server, createTradeProposal, getUserTrades, updateTradeStatus);
new AuctionController(server, createAuction, placeBid, getAuctions, endAuction);

server.listen("3004");
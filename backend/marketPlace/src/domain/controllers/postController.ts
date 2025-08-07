import { CreatePost } from "../../application/create_post_usecase";
import { GetPosts } from "../../application/get_posts_usecase";
import { UpdatePost } from "../../application/update_post_usecase";
import { DeletePost } from "../../application/delete_post_usecase";
import { GetPostById } from "../../application/get_post_by_id_usecase";
import { HttpServer } from "../../infra/http/httpserver";

export class PostController {
  constructor(
    readonly httpServer: HttpServer,
    readonly createPost: CreatePost,
    readonly getPosts: GetPosts,
    readonly updatePost: UpdatePost,
    readonly deletePost: DeletePost,
    readonly getPostById: GetPostById
  ) {
    // Criar um novo post
    this.httpServer.register("post", "/marketplace/createPost", async (params: any, body: any) => {
      try {
        const output = await createPost.execute(body);
        return output;
      } catch (error: any) {
        return { error: error.message };
      }
    });

    // Listar posts com filtros
    this.httpServer.register("get", "/marketplace/getPosts", async (params: any, body: any) => {
      const filters = {
        category: params.category,
        minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
        seller_id: params.seller_id,
        search: params.search,
        limit: params.limit ? parseInt(params.limit) : undefined,
        offset: params.offset ? parseInt(params.offset) : undefined
      };
      const output = await getPosts.execute(filters);
      return output;
    });

    // Buscar post por ID
    this.httpServer.register("get", "/marketplace/getPost/:post_id", async (params: any, body: any) => {
      const post_id = params.post_id;
      const output = await getPostById.execute(post_id);
      return output;
    });

    // Atualizar post
    this.httpServer.register("put", "/marketplace/updatePost", async (params: any, body: any) => {
      const output = await updatePost.execute(body);
      return output;
    });

    // Deletar post
    this.httpServer.register("delete", "/marketplace/deletePost", async (params: any, body: any) => {
      const output = await deletePost.execute(body);
      return output;
    });

    // Buscar posts por vendedor
    this.httpServer.register("get", "/marketplace/getPostsBySeller", async (params: any, body: any) => {
      const seller_id = params.seller_id;
      const output = await getPosts.execute({ seller_id });
      return output;
    });

    // Buscar categorias válidas
    this.httpServer.register("get", "/marketplace/getCategories", async (params: any, body: any) => {
      const { PostCategory } = await import("../../domain/vo/post_category");
      return PostCategory.getValidCategories();
    });
  }
}
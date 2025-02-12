import { Request, Response, Router } from 'express';
import ColecaoService from '../services/ColecaoService';
import ColecaoInterface from '../interfaces/entities/ColecaoInterface';
import {
  CreateColecaoValidator,
  GetColecaoValidator,
  UpdateColecaoValidator,
} from '../validators/ColecaoValidator';
import errorHandler from '../Errors/ErrorHandle';
import ColecaoServiceInterface from '../interfaces/services/ColecaoServiceInterface';
import ColecaoRepository from '../repositories/ColecaoRepository';
import { validationResult } from 'express-validator';

class ColecaoController {
  public routes = Router();
  private colecaoService: ColecaoServiceInterface;

  constructor() {
    // Cria uma instância de ColecaoService passando a classe ColecaoRepository como argumento
    this.colecaoService = new ColecaoService(ColecaoRepository);
    
    // Configura as rotas do controlador
    this.routes.get('/colecao', GetColecaoValidator, this.findAll.bind(this));
    this.routes.get('/colecao/:id', this.findById.bind(this));
    this.routes.post(
      '/colecao',
      CreateColecaoValidator,
      this.create.bind(this)
    );
    this.routes.put(
      '/colecao/:id',
      UpdateColecaoValidator,
      this.update.bind(this)
    );
    this.routes.delete('/colecao/:id', this.delete.bind(this));
  }
  // Manipulador para encontrar todas as coleções
  async findAll(request: Request, response: Response): Promise<Response> {
    try {
      // Valida a requisição usando o resultado da função validationResult
      const result = validationResult(request);
      if (!result.isEmpty()) {
      // Retorna erros de validação como uma resposta JSON se houver algum
        return response.status(422).json({ errors: result.array() });
      }
      // Chama o método findAll do colecaoService passando o parâmetro de consulta 'titulo'
      const colecoes = await this.colecaoService.findAll(request.query.titulo as string);
      // Retorna as coleções encontradas como uma resposta JSON
      return response.json(colecoes);
    } catch (error) {
      // Chama a função errorHandler para lidar com erros
      errorHandler(error, request, response, null);
    }
  }

  async findById(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const colecao = await this.colecaoService.findById(Number(id));
      return response.json(colecao);
    } catch (error) {
      errorHandler(error, request, response, null);
    }
  }

  // Manipulador para encontrar uma coleção por ID
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(422).json({ errors: result.array() });
      }
      const colecao = request.body as ColecaoInterface;
      const newColecao = await this.colecaoService.create(colecao);
      return response.json(newColecao);
    } catch (error) {
      errorHandler(error, request, response, null);
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(422).json({ errors: result.array() });
      }
      const { id } = request.params;
      const colecao = request.body as ColecaoInterface;
      const updatedColecao = await this.colecaoService.update(
        Number(id),
        colecao
      );
      return response.json(updatedColecao);
    } catch (error) {
      errorHandler(error, request, response, null);
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    try {
      // Extrai o parâmetro de rota 'id'
      const { id } = request.params;
      // Chama o método findById do colecaoService passando o ID convertido para número
      await this.colecaoService.delete(Number(id));
      // Retorna a coleção encontrada como uma resposta JSON
      return response.json({ message: 'Colecao removida com sucesso!' });
    } catch (error) {
      errorHandler(error, request, response, null);
      // Chama a função errorHandler para lidar com erros
    }
  }
}

export default new ColecaoController();

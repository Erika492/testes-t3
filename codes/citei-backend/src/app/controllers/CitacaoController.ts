import { Request, Response, Router } from 'express';
import CitacaoService from '../services/CitacaoService';
import CitacaoInterface from '../interfaces/entities/CitacaoInterface';
import { validationResult } from 'express-validator';
import {
  CreateCitacaoValidator,
  GetCitacaoValidator,
  UpdateCitacaoValidator,
} from '../validators/CitacaoValidator';
import CitacaoRepository from '../repositories/CitacaoRepository';
import ColecaoRepository from '../repositories/ColecaoRepository';
import errorHandler from '../Errors/ErrorHandle';
import CitacaoServiceInterface from '../interfaces/services/CitacaoServiceInterface';

class CitacaoController {
  public routes = Router();
  private citacaoService: CitacaoServiceInterface;

  constructor() {
    // Cria uma instância do serviço de citações, passando os repositórios necessários.
    this.citacaoService = new CitacaoService(
      CitacaoRepository,
      ColecaoRepository
    );
    // Configura as rotas para as operações CRUD de citações.
    this.routes.get('/citacao', GetCitacaoValidator, this.findAll.bind(this));
    this.routes.get('/citacao/:id', this.findById.bind(this));
    this.routes.post(
      '/citacao',
      CreateCitacaoValidator,
      this.create.bind(this)
    );
    this.routes.put(
      '/citacao/:id',
      UpdateCitacaoValidator,
      this.update.bind(this)
    );
    this.routes.delete('/citacao/:id', this.delete.bind(this));
  }
// Manipulador para encontrar todas as citações
  async findAll(request: Request, response: Response): Promise<Response> {
    try {
      
// Chama o método findAll do citacaoService passando o parâmetro de consulta 'titulo'
      const citacoes = await this.citacaoService.findAll(request.query.titulo as string);
      // Retorna as citações encontradas como uma resposta JSON
      return response.json(citacoes);
    } catch (error) {
      // Chama a função errorHandler para lidar com erros
      errorHandler(error, request, response, null);
    }
  }

  async findById(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const citacao = await this.citacaoService.findById(Number(id));
      return response.json(citacao);
    } catch (error) {
      errorHandler(error, request, response, null);
    }
  }
// Manipulador para encontrar uma citação por ID
  async create(request: Request, response: Response): Promise<Response> {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
      }
      const citacao = request.body as CitacaoInterface;
      const newCitacao = await this.citacaoService.create(citacao);
      return response.json(newCitacao);
    } catch (error) {
      errorHandler(error, request, response, null);
    }
  }

  async update(request: Request, response: Response): Promise<Response> {
    try {
      const result = validationResult(request);
      if (!result.isEmpty()) {
        return response.status(400).json({ errors: result.array() });
      }
      // Extrai o parâmetro de rota 'id'
      const { id } = request.params;
      const citacao = request.body as CitacaoInterface;
      // Chama o método findById do citacaoService passando o ID convertido para número
      const updatedCitacao = await this.citacaoService.update(
        Number(id),
        citacao
      );
           
// Retorna a citação encontrada como uma resposta JSON
      return response.json(updatedCitacao);
    } catch (error) {
     // Chama a função errorHandler para lidar com erros
      errorHandler(error, request, response, null);
    }
  }

  async delete(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      await this.citacaoService.delete(Number(id));
      return response.json({ message: 'Citacao removida com sucesso!' });
    } catch (error) {
      errorHandler(error, request, response, null);
    }
  }
}

export default new CitacaoController();

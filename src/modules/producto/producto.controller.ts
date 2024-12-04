import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { last } from 'rxjs';

@ApiTags('producto')
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  findAll() {
    return this.productoService.findAll();
  }
  
  @Get('back')
  async backend(@Req() req: Request) {
    const builder = await this.productoService.queryBuilder('productos');
  
    // Búsqueda por nombre
    if (req.query.q) {
      builder.where('productos.nombre LIKE :q', { q: `%${req.query.q}%` });
    }
  
    // Ordenar por precio
    const sort: any = req.query.sort;
    if (sort) {
      builder.orderBy('productos.precio', sort.toUpperCase());  // Asegúrate de que 'sort' sea 'asc' o 'desc'
    }
  
    // Obtener el valor de la página de la consulta
    const page: number = parseInt(req.query.page as any) || 1;  // Asegúrate de que 'page' es un número
    const limit: number = 3; // Número de productos por página
  
    // Si la página solicitada es menor o igual a 0, forzamos que sea la página 1
    const offset = (page - 1) * limit;
  
    // Asegúrate de que la paginación se calcula correctamente
    builder.offset(offset).limit(limit);
  
    // Ejecuta la consulta y devuelve los resultados
    const productos = await builder.getMany();

    const total=await builder.getCount();
    return { 
      data: await builder.getMany(),
      total:total,
      page,
      last_page: Math.ceil(total/limit)
    }
  
    // Verifica si hay productos para la página solicitada
    if (productos.length === 0) {
      // Puedes manejar un caso donde no haya productos en la página solicitada
      return {
        message: `No hay productos en la página ${page}`,
        page,
        limit,
        totalResults: await builder.getCount(),  // Obtén el total de productos
      };
    }
  
    return productos;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto) {
    return this.productoService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(+id);
  }
}

import { Injectable } from '@nestjs/common';
import { CreateVectorDto } from './dto/create-vector.dto';
import { UpdateVectorDto } from './dto/update-vector.dto';

@Injectable()
export class VectorService {
  create(createVectorDto: CreateVectorDto) {
    return 'This action adds a new vector';
  }

  findAll() {
    return `This action returns all vector`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vector`;
  }

  update(id: number, updateVectorDto: UpdateVectorDto) {
    return `This action updates a #${id} vector`;
  }

  remove(id: number) {
    return `This action removes a #${id} vector`;
  }
}

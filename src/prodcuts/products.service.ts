import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './products.model';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {

  constructor(@InjectModel('Product') private productModel: Model<Product>) {}

  async createProduct(title: string, description: string, price: number) {
    const newProduct = new this.productModel({ title, description, price });
    const result = await newProduct.save();
    return result.id as string;
  }

  async getProducts() {
    const result = await this.productModel.find();
    return result;
  }

  async getSingleProduct(productId: string) {
    const product = await this.findProduct(productId);
    return product;
  }

  async updateProduct(
    productId: string,
    title: string,
    desc: string,
    price: number,
  ) {
    const updatedProduct = await this.findProduct(productId);
    if (title) {
      updatedProduct.title = title;
    }
    if (desc) {
      updatedProduct.description = desc;
    }
    if (price) {
      updatedProduct.price = price;
    }
    updatedProduct.save();
  }

  async deleteProduct(id: string) {
    const product = await this.productModel.deleteOne({id});
    return product
  }

  private async findProduct(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Could not find product.');
    }
    return product;
  }
}

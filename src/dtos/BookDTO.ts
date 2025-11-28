// src/dtos/BookDTO.ts

export interface CreateBookDTO {
  title: string;
  author: string;
  isbn: string;
  // 'available' não é necessário na criação pois o padrão é true
}

export interface UpdateBookDTO {
  title?: string;
  author?: string;
  isbn?: string;
  available?: boolean;
}
import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

const SALT = 10;

@Injectable()
export class HashService {
  async hash(text: string): Promise<string> {
    return hash(text, SALT);
  }

  async compare(plainText: string, hashedText: string): Promise<boolean> {
    return compare(plainText, hashedText);
  }
}

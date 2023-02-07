import * as dotenv from 'dotenv';
dotenv.config();

import cloudinary from 'cloudinary';

class Config {
  public SERVER_PORT: string | undefined;
  public CLIENT_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public COOKIE_KEY_ONE: string | undefined;
  public COOKIE_KEY_TWO: string | undefined;
  public MONGODB_URL: string | undefined;
  public REDIS_HOST: string | undefined;
  public CLOUDINARY_NAME: string | undefined;
  public CLOUDINARY_API_KEY: string | undefined;
  public CLOUDINARY_API_SECRET: string | undefined;

  constructor() {
    this.MONGODB_URL = process.env.MONGODB_URL || '';
    this.SERVER_PORT = process.env.SERVER_PORT || '';
    this.CLIENT_URL = process.env.CLIENT_URL || '';
    this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
    this.COOKIE_KEY_ONE = process.env.COOKIE_KEY_ONE || '';
    this.COOKIE_KEY_TWO = process.env.COOKIE_KEY_TWO || '';
    this.REDIS_HOST = process.env.REDIS_HOST || '';
    this.CLOUDINARY_NAME = process.env.CLOUDINARY_NAME || '';
    this.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
    this.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
  }

  public validateConfig(): void {
    // loop through the object, to make sure the env variables are present
    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Config ${key} is undefined `);
      }
    }
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUDINARY_NAME,
      api_key: this.CLOUDINARY_API_KEY,
      api_secret: this.CLOUDINARY_API_SECRET
    });
  }
}

export const config: Config = new Config();

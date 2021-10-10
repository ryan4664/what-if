import { PrismaClient } from "@prisma/client";
import { DataSource } from "apollo-datasource";

export class Store extends DataSource {
  store: PrismaClient;

  context: Object;

  cache: Object;

  constructor(db: PrismaClient) {
    super();
    this.store = db;
  }

  initialize(config) {
    this.context = config.context;
    this.cache = config.cache;
  }
}

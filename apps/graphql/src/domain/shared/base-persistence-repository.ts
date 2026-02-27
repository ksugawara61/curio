import { ContextRepository } from "../../shared/context";
import {
  type DrizzleDb,
  DrizzleRepository,
  type Transaction,
} from "../../shared/drizzle";

export abstract class BasePersistenceRepository {
  protected readonly contextRepository: ContextRepository;
  protected readonly db: DrizzleDb | Transaction;

  constructor(ctx: ContextRepository, db: DrizzleDb | Transaction) {
    this.contextRepository = ctx;
    this.db = db;
  }

  static inTransaction<T extends BasePersistenceRepository>(
    this: new (
      ctx: ContextRepository,
      db: DrizzleDb | Transaction,
    ) => T,
    tx: Transaction,
  ): T {
    // biome-ignore lint/complexity/noThisInStatic: `this` is the concrete subclass constructor, enabling polymorphic instantiation
    return new this(ContextRepository.create(), tx);
  }

  static create<T extends BasePersistenceRepository>(
    this: new (
      ctx: ContextRepository,
      db: DrizzleDb | Transaction,
    ) => T,
    env?: Parameters<(typeof DrizzleRepository)["create"]>[0],
  ): T {
    // biome-ignore lint/complexity/noThisInStatic: `this` is the concrete subclass constructor, enabling polymorphic instantiation
    return new this(
      ContextRepository.create(),
      DrizzleRepository.create(env).getDb(),
    );
  }
}

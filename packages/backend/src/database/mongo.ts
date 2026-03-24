import mongoose from 'mongoose';

/**
 * Classe para gerenciar conexão MongoDB centralizada
 * INV-BKD-01: Conexão centralizada com retry exponencial e fail-fast
 */
export class MongoConnection {
  private static instance: MongoConnection;
  private connected = false;

  private constructor() {}

  public static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }
    return MongoConnection.instance;
  }

  /**
   * Conecta ao MongoDB com retry exponencial
   * INV-BKD-02: Pool de conexões configurável via ambiente
   */
  public async connect(): Promise<void> {
    if (this.connected) {
      console.log('[MongoDB] Já conectado');
      return;
    }

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gerenciador-provas';
    const dbName = process.env.MONGODB_DB_NAME || 'gerenciador-provas';
    const poolMin = parseInt(process.env.MONGODB_POOL_MIN || '5', 10);
    const poolMax = parseInt(process.env.MONGODB_POOL_MAX || '10', 10);
    const serverSelectionTimeoutMs = parseInt(
      process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS || '5000',
      10
    );

    const maxRetries = 5;
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        await mongoose.connect(mongoUri, {
          dbName,
          minPoolSize: poolMin,
          maxPoolSize: poolMax,
          serverSelectionTimeoutMS: serverSelectionTimeoutMs,
          socketTimeoutMS: 45000,
          retryWrites: true,
        });

        this.connected = true;
        console.log(`[MongoDB] Conectado com sucesso ao banco: ${dbName}`);
        return;
      } catch (error) {
        lastError = error as Error;
        const delayMs = Math.pow(2, i) * 1000;
        console.error(
          `[MongoDB] Falha de conexão (tentativa ${i + 1}/${maxRetries}): ${lastError.message}. Aguardando ${delayMs}ms...`
        );

        if (i < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw new Error(
      `[MongoDB] Falha ao conectar após ${maxRetries} tentativas: ${lastError?.message}`
    );
  }

  /**
   * Desconecta do MongoDB
   */
  public async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    await mongoose.disconnect();
    this.connected = false;
    console.log('[MongoDB] Desconectado');
  }

  /**
   * Verifica status da conexão
   * INV-BKD-03: Health-check para validar estado da conexão
   */
  public isConnected(): boolean {
    return this.connected && mongoose.connection.readyState === 1;
  }

  /**
   * Obtém a instância do mongoose para uso em schemas
   */
  public getConnection() {
    return mongoose.connection;
  }
}

export default MongoConnection.getInstance();

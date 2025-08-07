import { CreateTradeProposal } from '../application/usecases/createTradeProposal';
import { TradeRepositoryDatabase } from '../infra/database/repository/tradeRepository';
import { PostgresDatabase } from '../infra/database/databaseConnection/database';

describe('CreateTradeProposal', () => {
  let createTradeProposal: CreateTradeProposal;
  let tradeRepository: TradeRepositoryDatabase;
  let connectionDatabase: PostgresDatabase;

  beforeAll(() => {
    connectionDatabase = new PostgresDatabase();
    tradeRepository = new TradeRepositoryDatabase(connectionDatabase);
    createTradeProposal = new CreateTradeProposal(tradeRepository);
  });

  afterAll(async () => {
    // Clean up any created trades if necessary
    // For a real test, you'd want to clear the database after each test
  });

  test('should create a trade proposal successfully', async () => {
    const input = {
      proposer_id: 'test_proposer_id',
      receiver_id: 'test_receiver_id',
      target_post_id: 'test_post_id', // This should be a valid post_id in your DB
      offers: [{ cash_amount: 100 }], // Add a valid offer
      message: 'Test trade proposal',
      expiresInHours: 24,
    };

    await expect(createTradeProposal.execute(input)).resolves.not.toThrow();
  });
});

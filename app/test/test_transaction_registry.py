import unittest
from TransactionRegistry import TransactionRegistry
from Transaction import Transaction

class TestTransactionRegistry(unittest.TestCase):
    def setUp(self):
        self.registry = TransactionRegistry()
        self.registry.clear_registry()

        self.sampleTransactions = [
            Transaction(1, 'Transaction 1', 'Credit', 100, 'USD', '2024-01-01'),
            Transaction(2, 'Transaction 2', 'Debit', 200, 'USD', '2024-01-02')
        ]
    
    def test_add_transaction(self):
        self.registry.add_transaction(self.sampleTransactions[0])
        self.assertEqual(self.registry.count_registry(), 1)
    
    def test_find_transaction_by_id(self):
        self.registry.add_transaction(self.sampleTransactions[1])
        result = self.registry.find_transaction_by_id(2)
        self.assertIsNotNone(result)
        self.assertEqual(result.name, 'Transaction 2')

    def test_remove_transaction(self):
        self.registry.add_transaction(self.sampleTransactions[0])
        self.registry.add_transaction(self.sampleTransactions[1])
        result = self.registry.remove_transaction(2)
        self.assertEqual(self.registry.count_registry(), 1)

    def test_count_transactions(self):
        self.registry.add_transaction(self.sampleTransactions[0])
        self.registry.add_transaction(self.sampleTransactions[1])
        result = self.registry.count_registry()
        self.assertEqual(result, 2)
    
    def tearDown(self):
        self.registry.clear_registry()

if __name__ == "__main__":
    unittest.main()
import unittest
from TransactionRegistry import TransactionRegistry

class TestTransactionRegistry(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sampleTransactions = [
            {'transaction_id': 1, 'shop_name': 'Biedronka', 'type':'spozywcze', 'amaount': 100, 'currency': 'PLN', 'date':'2024-12-31'},
            {'transaction_id': 2, 'shop_name': 'Żabka', 'type':'spozywcze', 'amaount': 10, 'currency': 'PLN', 'date':'2024-11-01'}
        ]

    def setUp(self):
        self.registry = TransactionRegistry()
        self.registry.clear_registry()
    
    def test_add_transaction(self):
        self.registry.add_transaction(self.sampleTransactions[0])
        self.assertEqual(self.registry.count_registry(), 1)
    
    def test_find_transaction_by_id(self):
        self.registry.add_transaction(self.sampleTransactions[1])
        result = self.registry.find_transaction_by_id(2)
        self.assertIsNotNone(result)
        self.assertEqual(result['shop_name'], 'Żabka')

    def test_remove_transaction(self):
        self.registry.add_transaction(self.sampleTransactions[0])
        self.registry.add_transaction(self.sampleTransactions[1])
        result = self.registry.remove_transaction(2)
        self.assertEqual(self.registry.count_registry(), 1)
        self.assertEqual(result, True)

    def test_count_transactions(self):
        self.registry.add_transaction(self.sampleTransactions[0])
        self.registry.add_transaction(self.sampleTransactions[1])
        result = self.registry.count_registry()
        self.assertEqual(result, 2)
    
    def tearDown(self):
        self.registry.clear_registry()

if __name__ == "__main__":
    unittest.main()
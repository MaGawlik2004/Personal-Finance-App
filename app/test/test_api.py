import unittest
import requests

from TransactionRegistry import TransactionRegistry

BASE_URL = 'http://127.0.0.1:5000/api/transactions'

class TestApi(unittest.TestCase):

    def setUp(self):
        self.registry = TransactionRegistry()
        self.registry.clear_registry()

    def test_create_transaction(self):
        response = requests.post(BASE_URL, json={
            'transaction_id': 1,
            'name': 'Biedronka',
            'type': 'sporzywcze',
            'amount': 100,
            'currency': 'PLN',
            'date': '2024-12-31'
        })

        self.assertEqual(response.status_code, 201)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'Transaction Created')
    
    def test_create_transaction_fail(self):
        response = requests.post(BASE_URL, json={
            'transaction_id': 1,
            'type': 'sporzywcze',
            'amount': 100,
            'currency': 'PLN',
            'date': '2024-12-31'
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], "Missing parametr: 'name'")

    def test_update_transaction(self):
        response = requests.patch(f'{BASE_URL}/1', json={
            'name': 'Żabka',
            'amount': 50
        })

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'Transaction Updated')

    def test_update_transaction_not_found(self):
        response = requests.patch(f'{BASE_URL}/2', json={
            'name': 'Żabka',
            'amount': 50
        })

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Transaction Not Found')

    def test_update_transactions_invalid_data(self):
        response = requests.patch(f'{BASE_URL}/1', json={
        })

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Invalid JSON data')

    def test_get_transaction(self):
        response = requests.get(f'{BASE_URL}/1')

        self.assertEqual(response.status_code, 200)
        self.assertIn('name', response.json())
        self.assertEqual(response.json()['name'], 'Biedronka')

    def test_get_transaction_not_found(self):
        response = requests.get(f'{BASE_URL}/2')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Transaction Not Found')

    def test_delete_transaction(self):
        response = requests.post(BASE_URL, json={
            'transaction_id': 10,
            'name': 'Lidl',
            'type': 'sporzywcze',
            'amount': 200,
            'currency': 'PLN',
            'date': '2024-02-10'
        })
        response = requests.delete(f'{BASE_URL}/10')

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', response.json())
        self.assertEqual(response.json()['message'], 'Transaction Deleted')
    
    def test_delete_transaction_not_found(self):
        response = requests.delete(f'{BASE_URL}/20')

        self.assertEqual(response.status_code, 404)
        self.assertIn('error', response.json())
        self.assertEqual(response.json()['error'], 'Transaction Not Found')




if __name__ == "__main__":
    unittest.main()



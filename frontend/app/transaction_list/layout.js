import '../../styles/transaction_list.css';

export default function TransactionListLayout({ children }) {
    return (
      <div className='set_transaction_list'>
        <section>
            { children }
        </section>
      </div>
    );
  }
import '../../../styles/add_transaction.css';

export default function TransactionListLayout({ children }) {
    return (
      <div>
        <section>
            { children }
        </section>
      </div>
    );
  }
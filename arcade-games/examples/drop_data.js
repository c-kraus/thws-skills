const LEVELS = [
 { name: 'LEVEL 1 · ACCOUNT TYPES', lanes: [['ASSET', '#39ff14'], ['LIABILITY', '#ff4df0'], ['EQUITY', '#ffd400'], ['REVENUE', '#00e5ff'], ['EXPENSE', '#ff6a00']],
   items: [
    ['Cash', 0, 'Asset: a resource the company controls.'],
    ['Accounts Receivable', 0, 'Asset: customers owe us money, a future inflow.'],
    ['Inventory', 0, 'Asset: goods held for sale.'],
    ['Prepaid Rent', 0, 'Asset: rent paid in advance is a future benefit until it is used up.'],
    ['Equipment', 0, 'Asset: long-lived resource used in the business.'],
    ['Accounts Payable', 1, 'Liability: we owe our suppliers.'],
    ['Unearned Revenue', 1, 'Liability: customers paid in advance, we still owe the service.'],
    ['Bank Loan', 1, 'Liability: money borrowed that must be repaid.'],
    ['Dividend Payable', 1, 'Liability: dividend declared but not yet paid.'],
    ['Common Stock', 2, 'Equity: money contributed by the owners.'],
    ['Retained Earnings', 2, 'Equity: accumulated profits kept in the business.'],
    ['Service Revenue', 3, 'Revenue: earned by delivering services.'],
    ['Sales Revenue', 3, 'Revenue: earned by selling goods.'],
    ['Rent Expense', 4, 'Expense: the cost of using premises in the period.'],
    ['Wages Expense', 4, 'Expense: the cost of work used in the period.'],
    ['Depreciation Expense', 4, 'Expense: part of an asset used up in the period.']
   ] },
 { name: 'LEVEL 2 · NORMAL BALANCE', lanes: [['DEBIT', '#39ff14'], ['CREDIT', '#ff4df0']],
   items: [
    ['Cash', 0, 'Asset: normal balance is debit.'],
    ['Inventory', 0, 'Asset: normal balance is debit.'],
    ['Rent Expense', 0, 'Expense: normal balance is debit.'],
    ['Wages Expense', 0, 'Expense: normal balance is debit.'],
    ['Dividends', 0, 'Dividends reduce equity, so the account has a debit normal balance (contra-equity).'],
    ['Accounts Payable', 1, 'Liability: normal balance is credit.'],
    ['Bank Loan', 1, 'Liability: normal balance is credit.'],
    ['Common Stock', 1, 'Equity: normal balance is credit.'],
    ['Sales Revenue', 1, 'Revenue: normal balance is credit.'],
    ['Unearned Revenue', 1, 'Liability: normal balance is credit.']
   ] },
 { name: 'LEVEL 3 · WHAT DOES IT DO?', lanes: [['INCREASES IT', '#39ff14'], ['DECREASES IT', '#ff3355']],
   items: [
    ['DEBIT to Cash', 0, 'Cash is an asset with a debit normal balance: a debit increases it.'],
    ['CREDIT to Cash', 1, 'A credit is the opposite side for an asset: it decreases it.'],
    ['DEBIT to Accounts Payable', 1, 'Liabilities have a credit normal balance: a debit decreases them (we pay what we owe).'],
    ['CREDIT to Sales Revenue', 0, 'Revenue has a credit normal balance: a credit increases it.'],
    ['DEBIT to Rent Expense', 0, 'Expenses have a debit normal balance: a debit increases them.'],
    ['CREDIT to Unearned Revenue', 0, 'Liabilities have a credit normal balance: a credit increases them.'],
    ['DEBIT to Common Stock', 1, 'Equity has a credit normal balance: a debit decreases it.'],
    ['CREDIT to Accounts Receivable', 1, 'Assets have a debit normal balance: a credit decreases them (the customer paid).'],
    ['CREDIT to Bank Loan', 0, 'Liabilities have a credit normal balance: a credit increases them (we borrow more).'],
    ['DEBIT to Wages Expense', 0, 'Expenses have a debit normal balance: a debit increases them.']
   ] }
];

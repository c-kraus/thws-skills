const STATIONS = [
 ['Source document', 'Evidence of the transaction: invoice, receipt or bank advice.'],
 ['Journalize', 'Record the transaction as a journal entry, debits equal credits.'],
 ['Post to ledger', 'Transfer the entries to T-accounts and compute balances.'],
 ['Unadjusted trial balance', 'List all balances and check that debits equal credits.'],
 ['Adjusting entries', 'Record accruals, deferrals and depreciation at period end.'],
 ['Adjusted trial balance', 'List the balances again after adjustments and check equality.'],
 ['Financial statements', 'Derive the statement of profit or loss and the statement of financial position.'],
 ['Closing entries', 'Reset revenue, expense and dividend accounts to zero.']
];
const FAMILIES = {
  'Deferred expense': 'Cash was paid earlier and an asset is now partly consumed: Dr Expense, Cr Asset.',
  'Deferred revenue': 'Cash was received earlier and is now partly earned: Dr Liability, Cr Revenue.',
  'Accrued expense': 'Incurred but not yet paid or recorded: Dr Expense, Cr Liability.',
  'Accrued revenue': 'Earned but not yet invoiced or recorded: Dr Asset, Cr Revenue.',
  'Depreciation': 'A long-lived asset is partly used up: Dr Depreciation Expense, Cr Accumulated Depreciation.'
};
const SCENARIOS = [
 ['Insurance was paid in advance. Three of twelve months have passed.', 'Deferred expense'],
 ['A customer paid in advance. This month we delivered part of the service.', 'Deferred revenue'],
 ['Employees worked the last week of the month. Payday is next month.', 'Accrued expense'],
 ['We finished consulting work in December. The invoice goes out in January.', 'Accrued revenue'],
 ['The machine was used for another year.', 'Depreciation'],
 ['Bank interest for the last month will only be charged next month.', 'Accrued expense'],
 ['A customer prepaid a 12-month subscription. One month has passed.', 'Deferred revenue']
];

import Web3 from 'web3';

export function mockPrivateKeyForSubject(subject: string) {
  const pkey = localStorage.getItem(`mock:privateKey:${subject}`);
  if (pkey) return pkey;

  const account = new Web3().eth.accounts.create();
  localStorage.setItem(`mock:privateKey:${subject}`, account.privateKey);

  return account.privateKey;
}

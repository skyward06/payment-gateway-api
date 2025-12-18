export const TexitcoinNetwork = {
  // TEXITcoin Network
  /**
   * The message prefix used for signing Texitcoin messages.
   */
  messagePrefix: '\x19Texitcoin Signed Message:\n',
  /**
   * The Bech32 prefix used for Texitcoin addresses.
   */
  bech32: 'txc',
  /**
   * The BIP32 key prefixes for Texitcoin.
   */
  bip32: {
    /**
     * The public key prefix for BIP32 extended public keys.
     */
    public: 0x0436f6e1,
    /**
     * The private key prefix for BIP32 extended private keys.
     */
    private: 0x0436ef7d,
  },
  /**
   * The prefix for Texitcoin public key hashes.
   */
  pubKeyHash: 0x42,
  /**
   * The prefix for Texitcoin script hashes.
   */
  scriptHash: 0x41,
  /**
   * The prefix for Texitcoin Wallet Import Format (WIF) private keys.
   */
  wif: 0xc1,
};

export const TexitcoinRegtestNetwork = {
  // TEXITcoin Regtest Network
  /**
   * The message prefix used for signing Texitcoin messages.
   */
  messagePrefix: '\x19Texitcoin Signed Message:\n',
  /**
   * The Bech32 prefix used for Texitcoin regtest addresses.
   */
  bech32: 'rtxc',
  /**
   * The BIP32 key prefixes for Texitcoin regtest.
   */
  bip32: {
    /**
     * The public key prefix for BIP32 extended public keys (regtest).
     */
    public: 0x043587cf,
    /**
     * The private key prefix for BIP32 extended private keys (regtest).
     */
    private: 0x04358394,
  },
  /**
   * The prefix for Texitcoin regtest public key hashes.
   */
  pubKeyHash: 0x6f,
  /**
   * The prefix for Texitcoin regtest script hashes.
   */
  scriptHash: 0xc4,
  /**
   * The prefix for Texitcoin regtest Wallet Import Format (WIF) private keys.
   */
  wif: 0xef,
};

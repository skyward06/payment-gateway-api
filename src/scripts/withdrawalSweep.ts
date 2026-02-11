/**
 * Withdrawal Sweep Scheduler
 *
 * This script automatically sweeps funds from completed payment addresses
 * to merchant wallet addresses on a regular schedule (every 1-2 hours).
 * It also confirms broadcast withdrawals.
 *
 * Run with: npx ts-node -r tsconfig-paths/register src/scripts/withdrawalSweep.ts
 */

import 'dotenv/config';
import 'reflect-metadata';

import Container from 'typedi';

import { WithdrawalService } from '@/entity/withdrawal/withdrawal.service';

// Sweep interval: 1 hour (in milliseconds)
const SWEEP_INTERVAL = 60 * 60 * 1000; // 1 hour
// Confirmation check interval: 5 minutes
const CONFIRM_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes

class WithdrawalSweepScheduler {
  private withdrawalService: WithdrawalService;
  private isRunning = false;
  private lastSweepTime = 0;
  private lastConfirmCheckTime = 0;

  constructor() {
    this.withdrawalService = Container.get(WithdrawalService);
  }

  async start() {
    console.log('🚀 Withdrawal Sweep Scheduler started');
    console.log(`📊 Sweep interval: ${SWEEP_INTERVAL / 1000 / 60} minutes`);
    console.log(`🔄 Confirmation check interval: ${CONFIRM_CHECK_INTERVAL / 1000 / 60} minutes`);

    this.isRunning = true;

    // Run initial sweep immediately
    await this.runSweep();
    await this.runConfirmCheck();

    while (this.isRunning) {
      const now = Date.now();

      try {
        // Run sweep on schedule
        if (now - this.lastSweepTime >= SWEEP_INTERVAL) {
          await this.runSweep();
        }

        // Check confirmations more frequently
        if (now - this.lastConfirmCheckTime >= CONFIRM_CHECK_INTERVAL) {
          await this.runConfirmCheck();
        }
      } catch (error) {
        console.error('Error in sweep scheduler:', error);
      }

      // Sleep for 30 seconds between checks
      await this.sleep(30000);
    }
  }

  stop() {
    console.log('🛑 Withdrawal Sweep Scheduler stopping...');
    this.isRunning = false;
  }

  private async runSweep() {
    this.lastSweepTime = Date.now();
    console.log(`\n🔄 [${new Date().toISOString()}] Running auto-sweep...`);

    try {
      const result = await this.withdrawalService.sweepAllPayments();
      console.log(`📊 ${result.message}`);
    } catch (error) {
      console.error('Error during auto-sweep:', error);
    }
  }

  private async runConfirmCheck() {
    this.lastConfirmCheckTime = Date.now();

    try {
      const confirmed = await this.withdrawalService.confirmBroadcastWithdrawals();
      if (confirmed > 0) {
        console.log(`✅ Confirmed ${confirmed} withdrawal(s)`);
      }
    } catch (error) {
      console.error('Error checking withdrawal confirmations:', error);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Start the scheduler
const scheduler = new WithdrawalSweepScheduler();

// Handle graceful shutdown
process.on('SIGINT', () => scheduler.stop());
process.on('SIGTERM', () => scheduler.stop());

scheduler.start().catch(console.error);

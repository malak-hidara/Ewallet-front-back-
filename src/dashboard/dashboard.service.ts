import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class DashboardService {
     dataPath = path.join(process.cwd(), 'src/database', 'data.json');

  async getData() {
    const file = await fs.readFile(this.dataPath, 'utf-8');
    return JSON.parse(file);
  }
   async getUserData(userId: number) {
    const data = await this.getData();
    
    const user = data.users.find(u => u.id === userId);
    const cards = data.cards.filter(c => c.userId === userId);
    const cryptos = data.cryptoAcc.filter(c => c.userId === userId);
    const paypals = data.paypalAcc.filter(p => p.userId === userId);
    
    // Récupérer toutes les transactions liées aux comptes de l'utilisateur
    const cardIds = cards.map(c => c.id);
    const cryptoIds = cryptos.map(c => c.id);
    const paypalIds = paypals.map(p => p.id);
    
    const transactions = data.transactions.filter(t => 
      (t.accountType === 'card' && cardIds.includes(t.accountId)) ||
      (t.accountType === 'crypto' && cryptoIds.includes(t.accountId)) ||
      (t.accountType === 'paypal' && paypalIds.includes(t.accountId))
    );

    return {
      user,
      cards,
      cryptos,
      paypals,
      transactions
    };
  }
}
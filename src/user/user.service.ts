import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class UserService {
  private dataPath = path.join(process.cwd(), 'src', 'db', 'data.json');

  // Fonction pour trouver un utilisateur par email
  async findUserByEmail(email: string) {
    try {
      const file = await fs.readFile(this.dataPath, 'utf-8');
      const data = JSON.parse(file);
      return data.users.find((u) => u.email === email);
    } catch {
      // Si fichier n'existe pas, on retourne null
      return null;
    }
  }

  // Fonction async pour créer un nouvel utilisateur
  async createNewUser(user: { name: string; email: string; password: string }) {
    let data;
    try {
      const file = await fs.readFile(this.dataPath, 'utf-8');
      data = JSON.parse(file);
    } catch {
      data = { users: [] };
    }

    const newUser = {
      id: Date.now(),
      name: user.name,
      email: user.email,
      password: user.password,
      balance:0,
      createdAt: new Date().toISOString(),
    };

    data.users.push(newUser);
    await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));

    return newUser;
  }

  // Fonction signup qui utilise findUserByEmail et createNewUser
  async signUp(body: { name: string; email: string; password: string }) {
  try {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return { success: false, message: 'Tous les champs sont obligatoires' };
    }

    const exists = await this.findUserByEmail(email);
    if (exists) {
      return { success: false, message: 'Email déjà utilisé' };
    }

    const newUser = await this.createNewUser({ name, email, password });

    return {
      success: true,
      message: 'Utilisateur créé avec succès',
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    };
  } catch (err) {
    console.error('Erreur signup:', err);
    return { success: false, message: 'Erreur interne du serveur', error: err.message  };
  }
}
 async getDashboardData(userId: number) {
    const file = await fs.readFile(this.dataPath, 'utf-8');
    const data = JSON.parse(file);

    return {
      success: true,
      bankCards: data.bankCards.filter(c => c.userId === userId),
      paypals: data.paypals.filter(p => p.userId === userId),
      cryptos: data.cryptos.filter(c => c.userId === userId),
      transactions: data.transactions.filter(t => t.userId === userId),
    };
  }
}

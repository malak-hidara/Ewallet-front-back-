import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class AuthService {
   dataPath = path.join(process.cwd(), 'src', 'db', 'data.json'); 

   async findUserByEmail(email: string) {
    try {
      const file = await fs.readFile(this.dataPath, 'utf-8');
      const data = JSON.parse(file);
      return data.users.find((u) => u.email === email) || null;
    } catch (err) {
      console.error('Erreur lecture data.json:', err);
      return null;
    }
  }

  // Fonction login
  async Auth(body: { email: string; password: string }) {
    const { email, password } = body;

    if (!email || !password) {
      return { success: false, message: 'Tous les champs sont obligatoires' };
    }

    const user = await this.findUserByEmail(email);

    if (!user) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    if (user.password !== password) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

   
    return { success: true, message: 'Connexion réussie', user: { id: user.id, name: user.name, email: user.email,balance:user.balance } };
  }
}

# Développement

Le projet utilise Node.js 24, y compris sur Vercel et dans GitHub Actions.
Avec nvm, lancez `nvm use`, puis `pnpm install`.
Configurez `DATABASE_URL` dans `.env.local` pour votre branche Neon de développement,
puis lancez `pnpm db:migrate` et `pnpm dev`.

# TODOS

- [] fixer la taille des cartes de restaurants
- [x] page de "sign-in" a modifier lors de la deconnexion
- [] modifier le favicon "T3"
- [] épurer l'UI
- [] Utiliser Google Place API pour les restaurants (nom, adresse)
- [] version mobile/responsive

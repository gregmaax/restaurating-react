# Performances du changement de catégorie

Mesure du 10 octobre 2026 sur localhost, avec Node 24.21.0 et Next.js 15.5.21.

| Mesure                            |    Avant |    Après | Réduction |
| --------------------------------- | -------: | -------: | --------: |
| Réponse serveur médiane           | 168,4 ms |  91,6 ms |    45,6 % |
| Réponse serveur au 90e percentile | 180,0 ms | 112,1 ms |    37,7 % |
| Requêtes Neon par navigation      |        9 |        5 |    44,4 % |

## Modifications

La session est partagée entre les composants pendant un rendu serveur. La liste
des catégories est également partagée entre le menu et la page. Ce cache est
limité à la requête grâce à [`React.cache`](https://react.dev/reference/react/cache),
qui invalide ses résultats à chaque requête serveur. Il ne conserve pas les
données d'un utilisateur pour un autre.

Les lectures du profil et du compte OAuth s'exécutent en parallèle. Pendant une
navigation, la catégorie courante reste visible jusqu'à l'arrivée de la suivante.
L'écran de chargement initialement ajouté a été retiré après avoir constaté qu'il
masquait le contenu à chaque changement de catégorie et créait un effet de
rechargement. Les optimisations des requêtes sont conservées.

## Protocole

Deux copies du même code et des mêmes données Neon sont exécutées avec
`next build` puis `next start`. La copie de référence précède les modifications
de performance. Les requêtes HTTP utilisent les en-têtes RSC et l'arbre courant
du routeur pour demander une transition entre deux catégories.

Après le retrait de l'écran de chargement, trois transitions entre catégories
ont aussi été vérifiées dans le navigateur avec un délai artificiel de 750 ms
sur les requêtes RSC. Le document et l'en-tête restent les mêmes, et la catégorie
courante reste visible pendant l'attente, sans disparition du contenu.

Trois séries alternées avant/après comportent chacune 3 passages de chauffe et
21 mesures retenues, soit 63 mesures par version. Le chronomètre couvre la
réponse complète, pas uniquement le premier octet. La compilation et le cache
client du routeur sont exclus. La formule est
`100 × (avant − après) / avant`, appliquée aux médianes regroupées et aux
90es percentiles. Les [mesures brutes](./category-navigation-2026-10-10.json)
sont conservées.

Ces chiffres mesurent l'attente serveur sur la machine locale et une petite
collection. Ils ne constituent pas une mesure de l'affichage final dans le
navigateur, ni une garantie sur Vercel. La région Neon, le réseau et la taille
du carnet peuvent modifier les résultats.

## Reproduire

Sur une base de développement migrée, choisir un utilisateur existant avec au
moins deux catégories. Dans un premier terminal, démarrer la version construite
avec le traceur optionnel. Le port doit être réservé au benchmark pour que le
compteur ne contienne pas d'autres requêtes.

```sh
pnpm build
AUTH_TRUST_HOST=true NODE_OPTIONS="--import=$(pwd)/scripts/trace-neon-queries.mjs" \
  pnpm exec next start --port 3100 > /tmp/category-perf.log 2>&1
```

Dans un autre terminal :

```sh
BENCHMARK_USER_ID='<id utilisateur de développement>' \
BENCHMARK_URL=http://localhost:3100 \
BENCHMARK_TRACE_FILE=/tmp/category-perf.log \
BENCHMARK_MAX_QUERIES=5 \
BENCHMARK_OUTPUT=/tmp/category-perf.json \
node --env-file=.env --env-file=.env.local scripts/benchmark-categories.mjs
```

Le script produit une session de test temporaire en mémoire à partir de la
configuration locale. Il ne modifie ni les comptes ni les cookies du navigateur,
et accepte uniquement un serveur HTTP local. Il vérifie que chaque réponse
contient la catégorie demandée. `BENCHMARK_MAX_MS` permet d'ajouter un budget
de latence ; sa valeur dépend de l'environnement. Le budget de 5 requêtes
échouait sur la référence avec 9 requêtes et passe après les modifications.

La suite d'intégration est exécutée sur une branche Neon temporaire. Des
vérifications HTTP supplémentaires alternent deux utilisateurs réels et
contrôlent le refus d'accès aux catégories de l'autre utilisateur, ainsi que la
redirection vers la connexion sans session.

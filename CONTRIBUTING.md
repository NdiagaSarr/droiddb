# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **Droid DB** ! Ce guide vous explique comment participer au projet.

## 🚀 Pour Commencer

1. **Fork** le dépôt sur GitHub
2. **Clone** votre fork localement :
```bash
git clone https://github.com/votre-username/droiddb.git
cd droiddb
```

3. **Créez une branche** pour votre fonctionnalité :
```bash
git checkout -b feature/nom-de-votre-feature
```

## 📋 Types de Contributions

### 🐛 Signaler un Bug

Si vous trouvez un bug, créez une **Issue** avec :
- **Titre clair** décrivant le problème
- **Description détaillée** des étapes pour reproduire
- **Environnement** : PHP version, MySQL version, navigateur
- **Captures d'écran** si applicable
- **Comportement attendu** vs comportement actuel

### 💡 Proposer une Fonctionnalité

Pour suggérer une nouvelle fonctionnalité :
- Expliquez **pourquoi** cette fonctionnalité serait utile
- Décrivez **comment** elle devrait fonctionner
- Mentionnez les **cas d'usage** possibles

### 🔧 Soumettre du Code

#### Avant de Commencer

- Lisez le code existant pour comprendre l'architecture
- Respectez les conventions de nommage
- Commentez votre code si nécessaire

#### Standards de Code

**PHP** :
- PSR-4 autoloading avec namespaces
- CamelCase pour les méthodes/classes
- snake_case pour les variables/fichiers
- Toujours utiliser `declare(strict_types=1);` pour les nouveaux fichiers
- Documenter avec PHPDoc

**JavaScript** :
- ES6+ avec modules
- CamelCase pour tout
- Préférer `const` et `let`, éviter `var`
- Utiliser async/await pour l'asynchrone

**CSS** :
- Variables CSS pour les couleurs
- BEM-like naming pour les classes
- Mobile-first responsive

#### Process de Pull Request

1. **Codez** votre fonctionnalité ou correction
2. **Testez** localement :
   - Vérifiez que l'authentification fonctionne
   - Testez CRUD sur bases/tables/données
   - Vérifiez la console JS pour erreurs
   - Testez sur différents navigateurs si possible

3. **Commitez** avec des messages clairs :
```bash
git add .
git commit -m "feat: ajout de la recherche full-text"
```

Format des messages de commit :
- `feat:` nouvelle fonctionnalité
- `fix:` correction de bug
- `docs:` documentation
- `style:` formatage, point-virgules manquants
- `refactor:` refactoring
- `test:` tests
- `chore:` maintenance

4. **Poussez** vers votre fork :
```bash
git push origin feature/nom-de-votre-feature
```

5. **Créez une Pull Request** sur GitHub :
   - Décrivez ce que fait votre changement
   - Référencez les issues concernées (ex: "Fixes #123")
   - Incluez des captures d'écran pour les changements visuels

## 🧪 Testing

Avant de soumettre, vérifiez :

- [ ] L'application se charge correctement
- [ ] La connexion MySQL fonctionne
- [ ] La création/suppression de bases fonctionne
- [ ] La création/suppression de tables fonctionne
- [ ] L'édition de données en ligne fonctionne
- [ ] Les modales s'ouvrent et se ferment correctement
- [ ] Pas d'erreurs dans la console du navigateur
- [ ] Pas d'erreurs dans les logs PHP

## 📁 Structure à Respecter

```
droid_db/
├── app/
│   ├── Config/        # Configuration
│   ├── Controllers/   # Contrôleurs API
│   ├── Core/          # Router, Core classes
│   └── Models/        # Modèles de données
├── public/
│   ├── css/
│   ├── js/
│   │   ├── services/  # API services
│   │   ├── modules/   # Feature modules
│   │   ├── ui/        # UI components
│   │   └── utils/     # Utilities
│   └── index.php
└── views/             # Templates HTML
```

## 🎯 Idées de Contribution

### Fonctionnalités Souhaitées

- [ ] Export vers Excel (.xlsx)
- [ ] Gestion des utilisateurs MySQL (GRANT, REVOKE)
- [ ] Visualisation des relations entre tables
- [ ] Historique des requêtes SQL
- [ ] Mode sombre/clair toggle
- [ ] Support PostgreSQL
- [ ] Docker container
- [ ] Tests unitaires (PHPUnit, Jest)
- [ ] CI/CD GitHub Actions
- [ ] Internationalisation (i18n)

### Améliorations Techniques

- Optimisation des performances
- Refactoring legacy code
- Documentation du code
- Augmentation de la couverture de tests

## 📝 Documentation

Si vous ajoutez une fonctionnalité :
- Mettez à jour le README.md
- Ajoutez des commentaires dans le code
- Créez des exemples d'utilisation si pertinent

## ❓ Questions ?

- Ouvrez une **Issue** avec le label "question"
- Contactez les mainteneurs

## 🙏 Code de Conduite

- Soyez respectueux et constructif
- Acceptez les critiques positives
- Aidez les autres contributeurs
- Gardez un esprit ouvert

## 🔒 Sécurité

Si vous trouvez une vulnérabilité de sécurité :
- **NE PAS** ouvrir une issue publique
- Envoyez un email privé aux mainteneurs
- Attendez la correction avant de divulguer

---

Merci de contribuer à Droid DB ! 🎉

**Questions ?** N'hésitez pas à demander de l'aide.

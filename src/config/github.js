// Configuration des comptes GitHub à synchroniser automatiquement
export const GITHUB_CONFIG = {
  // Ajoutez ici vos noms d'utilisateur GitHub
  usernames: ['DavidDef04'], // Remplacez 'deuxieme-compte' par votre vrai nom d'utilisateur
  
  // Nombre maximum de projets par compte à récupérer
  maxProjectsPerAccount: 10,
  
  // Options de synchronisation
  autoSync: true,
  showLoadingIndicator: true,
  
  // Filtrage des projets
  filters: {
    excludeForks: true,
    excludePrivate: true,
    requireDescription: true
  }
};

// Pour ajouter votre deuxième compte, modifiez simplement:
// usernames: ['DavidDef04', 'votre-deuxieme-compte']

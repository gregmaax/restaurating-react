import CardWrapper from "./card-wrapper";

export default function SignIn() {
  return (
    <CardWrapper
      headerLabel="Bienvenue"
      backButtonHref="/"
      backButtonLabel="Retour à l'accueil"
      showSocial
    >
      <p className="hidden">Connectez-vous avec le service de votre choix</p>
    </CardWrapper>
  );
}

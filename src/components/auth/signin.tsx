import CardWrapper from "./card-wrapper";

export default function SignIn() {
  return (
    <CardWrapper
      headerLabel="Votre carnet vous attend"
      backButtonHref="/"
      backButtonLabel="Retour à l'accueil"
      showSocial
    >
      <p className="text-center text-sm leading-relaxed text-muted-foreground">
        Connectez-vous pour garder vos restaurants, vos notes et vos souvenirs
        au même endroit.
      </p>
    </CardWrapper>
  );
}

import { Card, CardFooter, CardHeader } from "../ui/card";
import BackButton from "./back-button";
import Header from "./header";

export default function ErrorCard() {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header label="Oups, erreur inattendue !" />
      </CardHeader>
      <CardFooter>
        <BackButton label="Retour à la page de connexion" href="/auth/login" />
      </CardFooter>
    </Card>
  );
}

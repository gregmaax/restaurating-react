"use client";

import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "~/actions/new-verification";
import CardWrapper from "../card-wrapper";
import FormSuccess from "~/components/form-success";
import FormError from "~/components/form-error";

export default function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success ?? error) return;

    if (!token) {
      setError("Token introuvable");
      return;
    }
    newVerification(token)
      .then((data) => {
        console.log("then new verification");
        console.log(token);
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Erreur inattendue");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirmer votre vérification"
      backButtonLabel="Retour à la page de connexion"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center justify-center">
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
}

import { Card, CardContent } from "~/components/ui/card";

interface MessageDisplayProps {
  message: string;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="p-4">
        <p className="text-center text-lg">{message}</p>
      </CardContent>
    </Card>
  );
}

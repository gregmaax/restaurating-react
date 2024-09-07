import { Card, CardContent } from "~/components/ui/card";

interface MessageDisplayProps {
  message: string;
}

export default function MessageDisplay({ message }: MessageDisplayProps) {
  return (
    <Card className="w-1/4 border">
      <CardContent className="p-8 sm:p-12 md:p-16">
        <p className="text-center text-lg font-medium italic text-black sm:text-xl md:text-2xl">
          {message}
        </p>
      </CardContent>
    </Card>
  );
}

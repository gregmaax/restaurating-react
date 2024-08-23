export const dynamic = "force-dynamic";

export default function CategoryPage() {
  return (
    <div className="flex w-full justify-center p-4 text-center">
      <h1
        className={`px-4 text-center text-xl font-bold text-gray-800`}
        style={{
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Aucune catégorie sélectionnée.
      </h1>
    </div>
  );
}

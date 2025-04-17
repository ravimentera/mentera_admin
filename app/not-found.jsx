export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
        Return to Home
      </a>
    </div>
  );
}
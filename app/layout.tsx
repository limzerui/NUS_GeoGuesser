import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API Key is missing. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment.");
  }

  return (
    <html lang="en">
      <body>
        {children}
        {apiKey && (
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=&v=weekly`}
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}

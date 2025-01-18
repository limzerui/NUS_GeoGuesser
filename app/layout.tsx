import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCmuSydoonBMiE1GuRf7bz2gT6ukeUISfk&libraries=&v=weekly"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}

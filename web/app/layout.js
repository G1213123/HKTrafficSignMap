import "./globals.css";

export const metadata = {
  title: "Road Sign Factory - Professional Traffic Sign Designer",
  description: "Professional online traffic sign designer and creator. Design custom road signs with Hong Kong TPDM standards. Export to SVG, DXF, and PDF formats.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/fabric@6.4.3/dist/index.js"></script>
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

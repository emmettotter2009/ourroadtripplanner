export const metadata = {
  title: "Our Road Trip Planner — Family Trip Planner",
  description: "Plan the perfect family road trip. Tell us about your crew, driving limits, hotel preferences, and we'll build a day-by-day itinerary just for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif", background: "#f9fafb" }}>
        {children}
      </body>
    </html>
  );
}

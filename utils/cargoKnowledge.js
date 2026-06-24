const KNOWLEDGE = [
  {
    keywords: ['create', 'new shipment', 'book', 'send cargo', 'place order'],
    answer:
      'To create a shipment, go to **Create Shipment** in the sidebar or click "+ Create Shipment" on the Dashboard. Fill in sender/receiver details, pickup & delivery addresses, cargo type, weight, and price. A unique tracking number is generated automatically.',
  },
  {
    keywords: ['track', 'tracking number', 'where is my', 'shipment status'],
    answer:
      'Use **Track Shipment** from the sidebar and enter your tracking number (format: CGO...). You can also open any shipment from the **Shipments** list to see its full timeline and delivery updates.',
  },
  {
    keywords: ['status', 'pending', 'in transit', 'delivered', 'cancelled'],
    answer:
      'Shipment statuses:\n• **Pending** — Created, awaiting pickup\n• **In Transit** — On the way to destination\n• **Delivered** — Successfully delivered\n• **Cancelled** — Order cancelled\n\nAdmins and drivers can update status from the Shipment Details page.',
  },
  {
    keywords: ['role', 'admin', 'customer', 'driver', 'permission', 'access'],
    answer:
      '**Roles & access:**\n• **Admin** — Full access: drivers, vehicles, reports, delete shipments\n• **Customer** — Create & view own shipments, track deliveries\n• **Driver** — View shipments and update delivery status',
  },
  {
    keywords: ['driver', 'drivers'],
    answer:
      '**Driver Management** (Admin only): Add drivers with name, phone, license number, and optional vehicle assignment. Go to **Drivers** in the sidebar to manage the fleet workforce.',
  },
  {
    keywords: ['vehicle', 'truck', 'van', 'fleet'],
    answer:
      '**Vehicle Management** (Admin only): Register trucks, vans, pickups, trailers, or containers with capacity and status (available, in_use, maintenance, inactive). Manage them under **Vehicles** in the sidebar.',
  },
  {
    keywords: ['dashboard', 'stats', 'statistics', 'summary'],
    answer:
      'The **Dashboard** shows total, delivered, in-transit, and pending shipments plus revenue summary. Admins also see a status pie chart and recent shipments table.',
  },
  {
    keywords: ['report', 'revenue', 'analytics', 'chart'],
    answer:
      '**Reports** (Admin only) includes total revenue, delivered revenue, delivery rate, status breakdown charts, and monthly revenue bar charts.',
  },
  {
    keywords: ['login', 'register', 'sign up', 'account', 'password'],
    answer:
      'Use **Login** or **Register** from the auth pages. Demo accounts:\n• Admin: admin@cargodelivery.com / admin123\n• Customer: customer@cargodelivery.com / customer123\n• Driver: driver@cargodelivery.com / driver123',
  },
  {
    keywords: ['search', 'filter', 'find shipment', 'pagination'],
    answer:
      'On the **Shipments** page, use the search bar to find by tracking number, sender/receiver name, or cargo type. Filter by status using the dropdown. Results are paginated for easy browsing.',
  },
  {
    keywords: ['price', 'cost', 'weight', 'cargo type'],
    answer:
      'When creating a shipment, specify **cargo type** (e.g. Electronics, Furniture), **weight** in kg, and **price** in USD. These are stored with the shipment and contribute to revenue reports.',
  },
  {
    keywords: ['help', 'hello', 'hi', 'what can you'],
    answer:
      "Hello! I'm CargoFlow Assistant. I can help with creating shipments, tracking deliveries, understanding roles, managing drivers & vehicles, and using the dashboard. What would you like to know?",
  },
];

const DEFAULT_ANSWER =
  "I'm not sure about that specific question. Try asking about: creating shipments, tracking orders, shipment statuses, user roles, drivers, vehicles, dashboard, or reports. You can also contact your system administrator for account-specific help.";

const scoreMatch = (message, keywords) => {
  const lower = message.toLowerCase();
  return keywords.reduce((score, kw) => (lower.includes(kw.toLowerCase()) ? score + kw.split(' ').length : score), 0);
};

const getKnowledgeAnswer = (message) => {
  let best = { score: 0, answer: null };

  for (const entry of KNOWLEDGE) {
    const score = scoreMatch(message, entry.keywords);
    if (score > best.score) best = { score, answer: entry.answer };
  }

  return best.score > 0 ? best.answer : DEFAULT_ANSWER;
};

const SYSTEM_PROMPT = `You are CargoFlow Assistant, a helpful AI support chatbot for the Cargo Service Delivery Management System (CargoFlow).

You help users with:
- Creating and managing shipments
- Tracking deliveries using tracking numbers (format: CGO...)
- Understanding shipment statuses: pending, in_transit, delivered, cancelled
- User roles: admin (full access), customer (own shipments), driver (update status)
- Driver and vehicle fleet management (admin only)
- Dashboard statistics and reports (admin only)
- Login, registration, and navigation

Keep answers concise, friendly, and formatted with bullet points when helpful. Only answer questions related to this cargo delivery system. If asked about unrelated topics, politely redirect to cargo delivery topics.

Demo login credentials:
- Admin: admin@cargodelivery.com / admin123
- Customer: customer@cargodelivery.com / customer123
- Driver: driver@cargodelivery.com / driver123`;

module.exports = { getKnowledgeAnswer, SYSTEM_PROMPT };
